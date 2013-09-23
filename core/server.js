global.redis = {};

var fs = require("fs");
var url = require("url");
var path = require("path");
var mime = require("./mime").types;


function loadModules() {
	var files = fs.readdirSync("./modules");
	files.forEach(function(file) {
		var service = require("../modules/"+file+"/server");
		if (service.config.redis)
			redis[service.config.service.port] = 
				require("redis").createClient(service.config.redis.port,service.config.redis.url);
		service.start();
	});
}

function onWebRequest(request, response) {
	try{	
		var postData = "";
		var pathname = url.parse(request.url).pathname;
		if (pathname === "/")
				pathname="/index.html";
		var realPath = "htdocs" + pathname;
		var ext = path.extname(realPath);
		ext = ext ? ext.slice(1) : 'unknown';
		request.setEncoding("utf8");
		request.on('error', function(e) {
			console.log(JSON.stringify(e));
		});		
		request.on("data", function(chunk) {
			postData += chunk;
		});		
		request.on("end",function() {
			fs.exists(realPath, function (exists) {
				if (!exists) {
					response.writeHead(404, {
						'Content-Type': 'text/plain'
					});
					response.write("This request URL " + pathname + " was not found on this server.");
					response.end();
				} else {
					fs.readFile(realPath, "binary", function (err, file) {
						if (err) {
							response.writeHead(500, {
								'Content-Type': 'text/plain'
							});
							response.write("error");
							response.end();
						} else {
							var contentType = mime[ext] || "text/plain";
							//if (pathname === "/channel.html")
								//contentType =  'text/html; charset=iso-8859-1';
							response.writeHead(200, {
								'Content-Type': contentType
							});
							response.write(file, "binary");
							response.end();
						}
					});
				}
			});
		});
	}catch(err){
		tool.log( err );
		response.writeHead(500, {
			'Content-Type': 'text/plain'
		});
		response.write("error");
		response.end();		
	}
}

exports.onWebRequest = onWebRequest;
exports.loadModules = loadModules;