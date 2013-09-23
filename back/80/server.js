var http = require("http");
var server = require('../../core/server');

var config={"service":{"name":"web","port":80}};
var service=this;
function start() {
	http.createServer(server.onWebRequest).listen(config.service.port);
	console.log(config.service.name + " server has started " + config.service.port + ".");	
}
exports.config = config;
exports.start = start;
