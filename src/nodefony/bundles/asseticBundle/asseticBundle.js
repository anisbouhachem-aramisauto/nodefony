/*
 *
 *
 *
 */

var Promise = require('promise');



nodefony.registerBundle ("assetic", function(){

	var assetic = class assetic extends nodefony.Bundle {

		constructor (kernel, container){
			
			super( kernel, container );

			// load bundle library 
			this.autoLoader.loadDirectory(this.path+"/core");
			this.container = container ;
			this.webDir =  kernel.rootDir + "/web";


			this.kernel.listen(this,"onPreBoot",() => {
				this.engineTwig =  this.kernel.get("templating").engine ;
				//console.log(this.engineTwig);
				this.createExtendJavascript();
				this.createExtendStylesheets();
			});
			this.environment = this.kernel.environment ;
			this.debug = this.kernel.debug ;
			this.kernelType  =  kernel.type ;
		};

		generateFileName (files){
			var ino ="";
			var tab = [];
			for ( var i=0 ; i < files.length ; i++ ){
				if ( files[i].slice(-1) === '*'  ){
					files[i] = files[i].slice(0, -1);
				}
				var file = new nodefony.fileClass( this.webDir + files[i] ) ;
				tab.push(file) ;
				ino+=file.stats.ino ; 
			}
			return 	{
				hash : crypto.createHash('md5').update(ino).digest("hex") ,
				files : tab
			}
		}

		createOutputFile (files, output, type){
			var ret = this.generateFileName( files ) ;
			if ( output  === ""){
				output = "/assets/"+type+"/"+ret.hash+"_assetic."+type ;
			}
			if (this.kernelType === "CONSOLE"){
				this.kernel.workerSyslog.logger("GENERATE FILE : " + output ,"INFO" );	
			}
			try {
				return  {
					name:output,	
					files:ret.files
				}
			}catch(e){
				throw e ;
			}
		}

		concatFiles (files, outputFile, myFilters, type){
			try {
				var data = "";
				if ( myFilters && myFilters.length){
					var hasFilters = true;
				}else{
					var hasFilters = false;
				}
				for ( var i=0 ; i < files.length ; i++ ){
					try {
						if ( hasFilters ){
							//TODO multiple filter
							for ( var j=0 ; j < myFilters.length ; j++ ){
								if (this.kernelType === "CONSOLE"){
									this.kernel.workerSyslog.logger("FILE : " + files[i].path + " FILTER : "+myFilters[j].name,"INFO" );	
								}
								myFilters[j].filter.call(myFilters[j], files[i] ,function(e, myData){
									if ( e) {
										throw e ;
									}
									data += myData ;
										
								}) ;
							}
							
						}else{
							data += files[i].read()  ;

						}
					}catch(err){
						throw err ;
					}
				}
				outputFile.write( data );
			}catch(e){
				throw e ;
			}
		}

		// try filter asunc !!!!!
		/*concatFiles (files, outputFile, myFilters, type){
			try {
				if ( myFilters && myFilters.length){
					var hasFilters = true;
				}else{
					var hasFilters = false;
				}
				var tab =[];
				for ( var i=0 ; i < files.length ; i++ ){
					//console.log(files[i].name);
					try {
						if ( hasFilters ){
							for ( var j=0 ; j < myFilters.length ; j++ ){
								var name = myFilters[j].name ;
								var logger = this.logger ;
								tab.push( new Promise( function(resolve, reject){
									return myFilters[j].filter.call(myFilters[j], files[i], function(e, mydata){
										if (e){
											return reject(e);
										}else{
											//logger( "APPLY FILTER ASSETIC : " + name, "DEBUG");
											resolve(mydata);	
											return mydata ;
										}
									}.bind(this))
								}) );
							}
						}else{
							tab.push( new Promise( function(resolve, reject){
								try {
									var mydata ="\n \/**** NODEFONY  CONCAT : "+ files[i].name +"  ***\/\n" ;
									mydata += files[i].content() ;
									resolve(mydata);
									return mydata ;
								}catch(e){
									return reject(e);	
								}
							}) );
						}
					}catch(err){
						throw err ;
					}
				}
				Promise.all(tab)
				.catch(function(e){
					this.logger(e,"ERROR");
					throw e ;
				}.bind(this))
				.then(function(ele){
					return ele ;
				}.bind(this))
				.done(function(ele){
					this.logger( "GENERATE ASSETIC " + outputFile.name, "DEBUG");
					try {
						var res = ele.join("\n");
						outputFile.write( res );
					}catch(e){
						throw e ;
					}
				}.bind(this))
			}catch(e){
				throw e ;
			}
		}*/


		genetateFile ( block , type){
			var files = [];  
			var filters = [];
			var output = "";
			switch (type){
				case "js" :
					var reg = /.*\.js$/ ;
				break;
				case "css" :
					var reg = /.*\.css$/ ;
				break;
			
			}

			for (var i=0 ; i < block.length ; i++){
				var line = block[i].replace(/\s*/g, "");
				if (line.match(/^\/\//) ){
					continue ;
				}
				//console.log(line)
				if ( line.match(/.*=.*/) ){
					var ret	 = line.split("=");
					//console.log(ret);
					switch ( ret[0]  ){
						case "output" :
						case "Output" :
						case "OUTPUT" :
							var rep = ret[1].replace(/'|\"|\s*/g, "");
							//console.log(rep)
							output =  rep ;
						break;
						case "filter" :
						case "Filter" :
						case "FILTER" :
							var rep = ret[1].replace(/'|\"|\s*/g, "");
							if ( rep.match(/^\?.*/) ){
								rep = rep.replace(/^\?/,"");
								if (this.kernelType === "CONSOLE"){
									if (  this.container.has( rep ) ){
										var fi = this.container.get(rep) ;
										filters.push( fi );
									}
								}else{
									if ( ! this.debug  && this.container.has( rep ) ){
										filters.push( this.container.get(rep) );
									}
								}
							}else{
								if (this.container.has( rep )) {
									filters.push( this.container.get(rep) );
								}
							}
						break;
						default :
							continue ;
					}
				}else{
					var rep = block[i].replace(/'|\"| /g, "");
					files.push(rep);
				}
			}

			try {
				var nodeOutput = this.createOutputFile(files, output, type);
				var res = [] ;
				for ( var i=0 ; i < nodeOutput.files.length ; i++ ){
					switch( nodeOutput.files[i].checkType() ){
						case "File":
							res.push( nodeOutput.files[i] );
						break;
						case "Directory":
							try {
								var finder = new nodefony.finder( {
									path:nodeOutput.files[i].path,
									recurse:true,
									match:reg,
									onFinish:(error, result) => {
										if(error){
											throw error ;
										}
										result.getFiles().forEach(function(file){
											res.push(file)	
										});
									}
								});
							}catch(e){
								throw e ;
							}
						break;
						default:
							throw new Error("Asset File must be an file or directory !!");
					}
				}
				if ( this.environment === "dev" || this.kernelType === "CONSOLE" ){
					//create file if not exist
					fs.openSync(this.webDir + output, 'w');
					var file = new nodefony.fileClass( this.webDir + output )
					this.concatFiles( res, file , filters, type);
				}
			}catch(error){
				throw error ;
			}
			return nodeOutput ;
		}

		createExtendJavascript (){
			//TODO
			/*this.engineTwig.extendFunction("javascripts", function(value, times) {
				console.log(arguments)
			});*/

			var that = this ;

			this.engineTwig.extend( (Twig) => {
				
    				Twig.exports.extendTag({
        				// unique name for tag type
        				type: "javascripts",
        				// regex for matching tag
        				regex: /^javascripts\s+(.*)\s*$/m,

        				// what type of tags can follow this one.
        				next: ["endjavascripts"], // match the type of the end tag
        				open: true,
        				compile:  (token) => {
            					var expression = token.match["input"];
						
						var res = expression.replace(/javascripts/, "");
						res = res.replace(/\s/g, "\n");
						res = res.split("\n" );
						res = res.filter(function(e){ return e === 0 || e });

						try {
							var res = this.genetateFile( res , "js");
						}catch(error){
							throw error ;
						}
            					// turn the string expression into tokens.
            					token.assetic = {
							output:res.name
            					};

            					delete token.match; // cleanup
            					return token;
        				},
        				parse:  function (token, context, chain)  {
						var cdn = that.settings.CDN.javascripts;
						if (cdn){
							context["asset_url"] = context.nodefony.url.protocol+"//"+cdn+token.assetic.output ;
						}else{
							context["asset_url"] = token.assetic.output ;
						}
                				var output = Twig.parse.apply(this, [token.output, context]);
            					return {
                					chain: chain,
                					output: output
            					};
        				}
    				});

    				// a matching end tag type
    				Twig.exports.extendTag({
        				type: "endjavascripts",
        				regex: /^endjavascripts$/,
        				next: [ ],
        				open: false
    				});
			});
		}

		createExtendStylesheets (){
			//TODO
			/*this.engineTwig.extendFunction("stylesheets", function(value, times) {
				console.log(arguments)
			});*/
			
			var that = this ;
			this.engineTwig.extend( (Twig) => {
				
    				Twig.exports.extendTag({
        				// unique name for tag type
        				type: "stylesheets",
        				// regex for matching tag
        				regex: /^stylesheets\s+(.*)\s*$/m,

        				// what type of tags can follow this one.
        				next: ["endstylesheets"], // match the type of the end tag
        				open: true,
        				compile: (token)  => {
            					var expression = token.match["input"];
						
						var res = expression.replace(/stylesheets/, "");
						res = res.replace(/\s/g, "\n");
						res = res.split("\n" );
						res = res.filter(function(e){ return e === 0 || e });

						try {
							var res = this.genetateFile( res , "css");
						}catch(error){
							throw error ;
						}

						//console.log("COMPILE : " +res.name)
            					// turn the string expression into tokens.
            					token.assetic = {
							output:res.name
            					};

            					delete token.match; // cleanup
            					return token;
        				},
        				parse:  function (token, context, chain)  {
						var cdn = that.settings.CDN.stylesheets ;
						if (cdn){
							context["asset_url"] = context.nodefony.url.protocol+"//"+cdn+token.assetic.output ;
						}else{
							context["asset_url"] = token.assetic.output ;
						}
						//console.log(this)
                				var output = Twig.parse.apply(this, [token.output, context]);
						//console.log("PARSE : " + token.assetic.output)
            					return {
                					chain: chain,
                					output: output
            					};
        				}
    				});

    				// a matching end tag type
    				Twig.exports.extendTag({
        				type: "endstylesheets",
        				regex: /^endstylesheets$/,
        				next: [ ],
        				open: false
    				});
			});
		}
	};

	return assetic;
});


