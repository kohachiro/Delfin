var Token = require("../../core/Token").Token;
var server = require('./server');

function isLogin(id, t, func) {
	var token = new Token();
	token.config=server.config.service;
	token.userid=id;
	token.get(function(err, reply) {
		if (token.token === t)
			return func(true);
		return func(false);
	});
}
function addMessageHeader( messageId, ab ) {
	var buffers=[];
	var data = new ArrayBuffer( 4 );
	var dataview = new DataView(data);
	dataview.setInt16(0, messageId, false);
	dataview.setUint16(2, ab.byteLength, false);
	buffers.push(new Buffer(new Uint8Array(data)));
	buffers.push(new Buffer(new Uint8Array(ab)));
	var buffer = Buffer.concat(buffers);
	return buffer;
}
function protoEncode(protoData,messageId) {
	var buffer = protoData.encode().toArrayBuffer();
	var message = addMessageHeader(messageId, buffer);
	return new Buffer( new Uint8Array(message) );
}
function tokenResponse(response, proto, messageId, userid) {
	if (response === null){
		proto.token = "";
		console.log(JSON.stringify(proto));
		return binResponse(response,proto,messageId);
	}
	var token = new Token();
	token.config = server.config.service;
	token.userid = userid;
	token.set(function(err, reply) {
		proto.token = token.token;
		console.log(JSON.stringify(proto));
		binResponse(response,proto,messageId);
	});
}
function binResponse(response, proto, messageId) {
	var buffer = proto.encode().toArrayBuffer();
	var message = addMessageHeader(messageId, buffer);	
	if (response !== null) {
		response.writeHead(200, {
			'Content-Type': 'application/octet-stream',
			'Content-Length': message.length
		});
		response.write(message);
		response.end();
	}
}

exports.isLogin = isLogin;
exports.protoEncode = protoEncode;
exports.binResponse = binResponse;
exports.tokenResponse = tokenResponse;
exports.addMessageHeader = addMessageHeader;