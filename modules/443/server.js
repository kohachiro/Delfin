var fs = require("fs");
var https = require("https");
var server = require('../../core/server');

var config={"service":{"name":"SSL","port":443}};
var service=this;
function start() {
	var options = {
			key: fs.readFileSync('cert/privatekey.pem'),
			cert: fs.readFileSync('cert/certificate.pem')
	};
	https.createServer(options,server.onWebRequest).listen(config.service.port);	
	console.log(config.service.name + " server has started " + config.service.port + ".");
}
exports.config = config;
exports.start = start;
