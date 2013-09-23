var http = require("http");
var url = require("url");
var tool = require('../../core/tool');


var config={"service":{"name":"toplist","port":50010},"redis":{"url":"localhost","port":6379}};

var service = require('./serviceTopList');

function start() {	
	function onRequest(request, response) {
		var postData = "";	
		var pathname = url.parse(request.url).pathname;
		request.setEncoding("utf8");
		request.on('error', function(e) {
			console.log(JSON.stringify(e));
		});		
		request.on("data", function(chunk) {
			postData += chunk;
		});		
		request.on("end",function() {
			//try {
				var action=pathname.substring(1);
				if (typeof (service[action]) === 'function') {
					service[action](request, response, postData);
				} else {
					tool.httpLog(request, postData);
					response.writeHead(404, {"Content-Type" : "text/plain"});
					response.write("404 Not found");
					response.end();
				}
			/*}catch (err) {
				console.log(err);
				response.writeHead(500, {"Content-Type" : "text/plain"});
				response.write("500 Server Error");
				response.end();
			}*/
		});		
	}	
	http.createServer(onRequest).listen(config.service.port);
	console.log(config.service.name +" server has started " + config.service.port + ".");
}

exports.config = config;
exports.start = start;

