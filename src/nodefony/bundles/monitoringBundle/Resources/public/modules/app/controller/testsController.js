
stage.registerController("testsController", function() {
	/**
	 * 
	 */
	var controller = function(container, module) {
		this.mother = this.$super;
		this.mother.constructor();
		
		this.config = this.module.config;
		this.router = container.get("router");

			// ROUTES 
		this.router.createRoute("tests", "/tests", {
			controller:"appModule:tests:index"
		});
		
		this.loadSocket = null ;

	}




	controller.prototype.indexAction = function(){
	
		var navView = this.renderDefaultContent("appModule:tests:tests", {
		});

		var isClose = true ;
		$("#startLoad").click(function(){
			if ( ! isClose ){
				$("#result").append('WEBSOCKET ALREADY OPEN : </br>');
				return ;
			}
			var location = window.location ;
			var protocol = location.protocol ;
			switch (protocol){
				case "https:":
					this.loadSocket = new WebSocket("wss://"+location.host+"/nodefony/test/load");
				break;
				case "http:":
					this.loadSocket = new WebSocket("ws://"+location.host+"/nodefony/test/load");
				break;
			}	
			this.loadSocket.onopen = function (event) {
				$("#result").empty();
				isClose=false;
				var toSend = $("#loadForm").serialize() ;
				$("#result").append('WEBSOCKET EVENT OPEN </br>');
				this.loadSocket.send(JSON.stringify({
					query:toSend,
					type:"http"
				})); 
			}.bind(this);
			
			this.loadSocket.onerror = function(error){
				$("#result").append('WEBSOCKET SOCKET ERROR : '+error);
			};
			this.loadSocket.onmessage = function(message){
				$("#result").append( message.data + "</br>")
			};
			this.loadSocket.onclose = function(event){
				isClose = true ;
				$("#result").append("WEBSOCKET SERVER CLOSE : "+event.reason)
			};

		}.bind(this));


		var isClose = true ;
		$("#startLoadHttps").click(function(){
			if ( ! isClose ){
				$("#resultHttps").append('WEBSOCKET ALREADY OPEN : </br>');
				return ;
			}
			var location = window.location ;
			var protocol = location.protocol ;
			switch (protocol){
				case "https:":
					this.loadSocket = new WebSocket("wss://"+location.host+"/nodefony/test/load");
				break;
				case "http:":
					this.loadSocket = new WebSocket("ws://"+location.host+"/nodefony/test/load");
				break;
			}	
			this.loadSocket.onopen = function (event) {
				$("#resultHttps").empty();
				isClose=false;
				var toSend = $("#loadFormHttps").serialize() ;
				$("#resultHttps").append('WEBSOCKET EVENT OPEN </br>');
				this.loadSocket.send(JSON.stringify({
					query:toSend,
					type:"https"
				})); 
			}.bind(this);
			
			this.loadSocket.onerror = function(error){
				$("#resultHttps").append('WEBSOCKET SOCKET ERROR : '+error);
			};
			this.loadSocket.onmessage = function(message){
				$("#resultHttps").append( message.data + "</br>")
			};
			this.loadSocket.onclose = function(event){
				isClose = true ;
				$("#resultHttps").append("WEBSOCKET SERVER CLOSE : "+event.reason)
			};

		}.bind(this));



		return navView ;

	}

	return controller ;

});
