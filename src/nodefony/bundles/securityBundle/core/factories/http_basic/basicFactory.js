/*
 *
 *	HTTP BASIC  FACTORY	
 *
 *
 *
 */

nodefony.register.call(nodefony.security.factory, "http_basic",function(){

	var Factory = function(contextSecurity, settings){
		this.name = this.getKey();
		this.contextSecurity = contextSecurity ;
		this.settings = settings ;
		this.token = "Basic"; 
	};

	Factory.prototype.getKey = function(){
		return "http_basic";
	};

	Factory.prototype.getPosition = function(){
		return "http";
	};

	Factory.prototype.handle = function(context, callback){

		var token = new nodefony.security.tokens[this.token](context.request, context.response, this.settings);
		this.contextSecurity.logger("TRY AUTHORISATION "+token.name ,"DEBUG")
		try {
			if (! token.authorization){ 
				context.response.headers["WWW-Authenticate"] = token.generateResponse();
				callback( {
					status:401,
					message:"Unauthorized"
				},null);
				return ;	
			}
			token.checkResponse( this.contextSecurity.provider.getUserPassword.bind(this.contextSecurity.provider), function(error, result){
				if (error){
					context.response.headers["WWW-Authenticate"] = token.generateResponse();
					callback( error ,null);
					return ;
				}
				if ( result === true ){
					this.contextSecurity.provider.loadUserByUsername(token.username, function(error, result){
						if ( error ){
							context.response.headers["WWW-Authenticate"] = token.generateResponse();
							callback( error, null) ;
							return ;
						}
						context.user = 	result;
						callback(null, token)
					}.bind(this));
				}
			}.bind(this))
			
		}catch(e){
			context.response.headers["WWW-Authenticate"] = token.generateResponse();
			callback( e, null);
		}
	
	}

	return Factory ;

});

