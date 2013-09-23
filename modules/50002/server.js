var http = require("http");

var config={"service":{"name":"slots","port":50002},"redis":{"url":"localhost","port":6379}};
var service = require('./serviceSlots');

function start() {	
	function onRequest(request, response) {
		var list = [];
		var len=0;
		request.on('error', function(e) {
			console.log(JSON.stringify(e));
		});			
		request.on("data", function(chunk) {
			list.push(chunk);
			len += chunk.length;
		});
		request.on("end",function() {
			var putData = Buffer.concat(list, len);
			service.assign( response, putData );
		});
	}
	http.createServer(onRequest).listen(config.service.port);
	console.log(config.service.name +" server has started " + config.service.port + ".");
}
exports.config = config;
exports.start = start;

