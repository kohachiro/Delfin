var http = require("http");
var server = require('../../core/server');

var config={"service":{"name":"policy","port":843}};
var service=this;
function start() {
	function onRequest(request, response) {
		var body='<?xml version="1.0"?>\r\n' +
		//'<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">' +
		'<cross-domain-policy>\r\n' +
		'\t<allow-access-fromdomain="*" />\r\n' +
		'</cross-domain-policy>\r\n';
		response.writeHead(200, {
			'Content-Type': 'text/xml',
			'Content-Length': body.length
		});
		response.write(body);
		response.end();
		request.on('error', function(e) {
			console.log(JSON.stringify(e));
		});			
	}	
	http.createServer(onRequest).listen(config.service.port);
	console.log(config.service.name + " server has started " + config.service.port + ".");	
}
exports.config = config;
exports.start = start;
