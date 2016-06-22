#!/usr/local/bin/node

var http = require("http");

var options = {
	hostname: 'nodefony.com',
	port: 5151,
	path: null,
	method: 'GET'
};

var i = 0 ;


var inter = setInterval(function(){

	if ( i % 2) 
		var multi = 100 ;
	else
		var multi = 1000 ;

	var random = Math.random()*multi ;
	console.log("INTERVAL TIME :" + random );

	var interval = setInterval(function(){

		if ( i % 2) 
			//options.path="/api/syslog";
			options.path="/demo/login";
		else
			options.path="/nodefony/api/syslog";

		var req = http.request(options, function(it, res) {
	  		//console.log('STATUS: ' + res.statusCode);
	    		//console.log('HEADERS: ' + JSON.stringify(res.headers));
	      		res.setEncoding('utf8');
	        	res.on('data', function (index,chunk) {
				//console.log('BODY: ' + chunk);
				console.log('BODY: ' + it);
				//console.log(res.statusCode)
			}.bind(this, i));
		}.bind(this,i));


		req.on('error', function(e) {
	  		console.log('problem with request: ' + e.message);
		});

		// write data to request body
		// req.write('data\n');
		// req.write('data\n');
		req.end();
		i++
	}, random);

	setTimeout(function(){
		clearInterval( interval )	
	}, 999 * 10 )

}, 1000 * 10 );



