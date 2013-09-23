
var server = require('./server');
server.loadModules();
process.on('uncaughtException', function (err) {
	console.log(JSON.stringify(err));
});