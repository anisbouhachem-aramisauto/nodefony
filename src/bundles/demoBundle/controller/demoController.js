/*
 *
 *
 *
 *	CONTROLLER default
 *
 *
 *
 *
 */

var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;


nodefony.registerController("demo", function(){

	var demoController = function(container, context){
		this.mother = this.$super;
		this.mother.constructor(container, context);
	};

	/**
 	 *
 	 *	DEMO index 
 	 *
 	 */
	demoController.prototype.indexAction= function(){
		var kernel = this.get("kernel") ;
		return this.render("demoBundle:Default:index.html.twig",{
			user: this.context.user,
			nodefony:kernel.settings.name + " " + kernel.settings.system.version
		});
	};

	/**
 	 *
 	 *	DEMO navbar 
 	 *
 	 */
	demoController.prototype.navAction = function(login){
		var webrtcBundle = this.get("kernel").getBundles("webRtc"); 
		return this.render('demoBundle:layouts:navBar.html.twig',{
			user: this.context.user,
			webrtc:webrtcBundle
		});	
	}

	/**
 	 *
 	 *	DEMO RENDER RAW RESPONSE  SYNC  
 	 *
 	 */
	demoController.prototype.rawResponseSyncAction= function(){
		
		var kernel = this.get("kernel") ;
		var settings = kernel.settings ;
		var content = '<xml><nodefony>\
			<kernel name="'+settings.name+'" version="'+settings.system.version+'">\
				<server type="HTTP" port="'+settings.system.httpPort+'"></server>\
				<server type="HTTPS" port="'+settings.system.httpsPort+'"></server>\
			</kernel>\
		</nodefony></xml>';
		return this.renderResponse(content, 200 , {
			"content-type" :"Application/xml"
		})
	};

	/**
 	 *
 	 *	DEMO RENDER RAW RESPONSE ASYNC  
 	 *
 	 */
	demoController.prototype.rawResponseAsyncAction= function(){
		var kernel = this.get("kernel") ;
		var settings = kernel.settings ;

		// async CALL
		var childHost =  exec('hostname', function(error, stdout, stderr){
			var hostname = stdout ;	

			var content = '<xml><nodefony>\
			<kernel name="'+settings.name+'" version="'+settings.system.version+'">\
				<server type="HTTP" port="'+settings.system.httpPort+'"></server>\
				<server type="HTTPS" port="'+settings.system.httpsPort+'"></server>\
				<hostname>'+hostname+'</hostname>\
			</kernel>\
			</nodefony></xml>';
			return this.renderResponse(content, 200 , {
				"content-type" :"Application/xml"
			})
		}.bind(this));
	};

	/**
 	 *	 renderView 
 	 *		
 	 */
	demoController.prototype.renderviewAction= function(name){
		var content = this.renderView('demoBundle:Default:index.html.twig',{name:"render"});
		return this.getResponse(content);
	};

	/**
 	 *
 	 *	DEMO ORM ASYNC CALL WITH ENTITIES 
 	 *
 	 */
	demoController.prototype.sequelizeAction = function(){
		var orm = this.getORM() ;
		
		
		this.sessionEntity = orm.getEntity("session");
		this.userEntity = orm.getEntity("user");


		var sessions = null ; 
		var users = null ; 

		// SIMPLE ORM CALL RENDER WITH SEQUELIZE PROMISE
		/*this.sessionEntity.findAll()
		.then( function(results){
			sessions = results
		})
		.catch(function(error){
			throw error ;
		})
		.done(function(){
			return this.renderAsync('demoBundle:orm:artists.html.twig', {
				sessions:sessions,
			});
		}.bind(this))*/

		// MULTIPLE ORM CALL ASYNC RENDER WITH PROMISE 
		Promise.all([this.sessionEntity.findAll(), this.userEntity.findAll()] )
		.then(function(result){
			sessions = result[0];
			users = result[1];
		}).catch(function(error){
			throw error ;
		}).done(function(){
			this.renderAsync('demoBundle:orm:orm.html.twig', {
				sessions:sessions,
				users:users,
			});
		}.bind(this))
	}

	/**
 	 *
 	 *	DEMO ORM ASYNC CALL WITHOUT ENTITIES 
 	 *	SQL SELECT
 	 *
 	 */
	demoController.prototype.querySqlAction = function(){

		var orm = this.getORM() ;

		var nodefonyDb = orm.getConnection("nodefony") ;

		var users = null ;
		nodefonyDb.query('SELECT * FROM users')
		.then(function(result){
			users = result[0];
		}.bind(this))
		.done(function(){
			this.renderAsync('demoBundle:orm:orm.html.twig', {
				users:users,
			});
		}.bind(this))
	}

	/**
 	 *
 	 *	DEMO ORM ASYNC CALL WITHOUT ENTITIES 
 	 *	SQL WITH JOIN 
 	 *
 	 *
 	 */
	demoController.prototype.querySqlJoinAction = function(){

		var orm = this.getORM() ;

		var nodefonyDb = orm.getConnection("nodefony") ;

		var joins = null ;
		nodefonyDb.query('SELECT * FROM sessions S LEFT JOIN users U on U.id = S.user_id ')
		.then(function(result){
			joins = result[0];
			for (var i = 0 ; i < joins.length ; i++){
				joins[i].metaBag = JSON.parse( joins[i].metaBag )
			}
		}.bind(this))
		.done(function(){
			this.renderAsync('demoBundle:orm:orm.html.twig', {
				joins:joins,
			});
		}.bind(this))
	}

	/*
 	 *
 	 *	SYSTEM CALL NODEJS WITH PROMISE
 	 */
	demoController.prototype.syscallAction = function(){

		var tab =[];

		// system call  exec synchrone hostname
		tab.push (new Promise( function(resolve, reject){
			try {
				var childHost =  execSync('hostname');
				var res = childHost.toString() ;
				resolve(res);	
				return 	res ;	
			}catch(e){
				reject(e) ;	
			}
		}));
			
		// exec PWD
		tab.push (new Promise( function(resolve, reject){
			return exec("pwd", function(error, stdout, stderr){
				if ( error ){
					return reject(error);
				}
				if ( stderr ){
					this.logger(stderr, "ERROR");
				}
				return resolve(stdout) ;	
			}.bind(this))
		
		}.bind(this)));


		// system call  spawn ping  
		tab.push (new Promise( function(resolve, reject){
			var du = spawn('ping', ['-c', "3", "google.com"]);
			var str = "" ;
			var err = "" ;
			var code = "" ;

			du.stdout.on('data',function(data){
				str+= data ;
			});

			du.stderr.on('data',function(data){
				err+= data ;
				this.logger("ERROR : " +  err,"ERROR");
			}.bind(this));

			du.on('close',function(code){
				code = code ;
				this.logger("child process exited with code : " + code, "INFO");
				resolve({
					ping:str,
					code:code,
					error:err
				});
			}.bind(this));
		}.bind(this)));

		var ping = "" ;
		var err = "" ;
		var code = "" ;
		var hostname = "";
		var pwd = "" ;

		// CALL PROMISE 
		Promise.all(tab)
		.catch(function(e){
			this.logger(e,"ERROR");
			throw e ;
		}.bind(this))
		.then(function(result){
			// format result for pass in renderAsync view   
			hostname = result[0];
			pwd = result[1] ;
			ping = result[2].ping ;
			code = result[2].code ;
			err = result[2].err ;
		}.bind(this))
		.done(function(ele){
			this.logger( "PROMISE SYSCALL DONE" , "DEBUG");
			try {
				this.renderAsync("demoBundle:Default:exec.html.twig", {
					hostname:hostname,
					ping:ping,
					pwd:pwd,
					code:code,
					error:err,
					date:new Date()
				});
			}catch(e){
				throw e ;
			}
		}.bind(this))
	}


	/*
 	 *
 	 *	HTTP REQUEST FOR PROXY  
 	 */
	demoController.prototype.httpRequestAction = function(){

		var options = {
  			hostname: 'www.google.com',
  			port: 80,
  			method: 'GET'
		};
		var req = http.request(options, function(res) {
			//console.log('STATUS: ' + res.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(res.headers));
			var bodyRaw = "";
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				this.logger( chunk, "DEBUG");
				bodyRaw += chunk ;
			}.bind(this));

			res.on('end', function(){
				this.renderAsync("demoBundle:Default:httpRequest.html.twig", {
					bodyRaw:bodyRaw,
				});
			}.bind(this))

		}.bind(this));

		req.on('error', function(e) {
			this.logger('Problem with request: ' + e.message, "ERROR");
		}.bind(this));

		req.end();
	}



	
	/**
 	 *	@see getResponse() with content
 	 *
 	 */
	demoController.prototype.htmlAction= function(name){
		var name = "nodefony";
		return this.getResponse('<html><script>alert("'+name+'")</script></html>');
	};

	/**
 	 *
 	 *	@see forward
 	 */
	demoController.prototype.forwardAction= function(){
		return this.forward("frameworkBundle:default:index")
	};
	
	/**
 	 *
 	 *	@see redirect
 	 */
	demoController.prototype.redirectGoogleAction= function(){
		return this.redirect("http://google.com");
	};

	/**
 	 *
 	 *	@see redirect with variables 
 	 *	@see generateUrl 
 	 */
	demoController.prototype.generateUrlAction = function(){
		return this.redirect ( this.generateUrl("user", {name:"cci"},true) );	
	};

	/**
	 *
	 *	@method indexRealTimeAction
	 *
	 */
	demoController.prototype.indexRealTimeAction = function(){
		return this.render("demoBundle:realTime:index.html.twig",{title:"realTime"});			
	};

	/*
 	 *
 	 *	UPLOAD
 	 *
 	 */
	demoController.prototype.indexUploadAction= function(){
		return this.render('demoBundle:demo:upload.html.twig');
	};

	demoController.prototype.uploadAction = function(){
	
		var files = this.getParameters("query.files");
		var path =  this.get("kernel").rootDir+"/src/bundles/demoBundle/Resources/images" ;	
		for (var file in files){
			if( files[file].error ){
				throw files[file].error ;
			}
			//files[file].move("/tmp/");
			files[file].move(path);
			//console.log( files[file].getExtention() )
			//console.log( files[file].getMimeType() )
			//console.log( files[file].realName() )
		}
		if ( ! this.isAjax() ){
			return this.forward("demoBundle:finder:index");
		}else{
			return this.renderResponse(
					JSON.stringify({
						res : "ok"
					}), 
				200, 
				{'Content-Type': 'application/json; charset=utf-8'}
			);
		}
	};

	return demoController;
});

