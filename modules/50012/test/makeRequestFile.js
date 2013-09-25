
var comm = require("../comm");
var fs = require('fs');  

var Protocol = require("protobufjs").protoFromFile("./modules/50012/proto/Protocol.proto").build("proto").MessageHandler;
var Data = require("protobufjs").protoFromFile("./modules/50012/proto/Data.proto").build("proto");

var loginRequestData = new Data.LoginRequestData({"username":"test","password":"1234"});
var data=comm.protoEncode(loginRequestData,Protocol.LoginRequest);

console.log(data);

fs.writeFile("loginRequestData.bin",data);

//curl -T "loginRequestData.bin" http://localhost:50012