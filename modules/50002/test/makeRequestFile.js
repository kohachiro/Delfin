var handler = require("./handler/handler");
var server = require("./handler/server");
var tool = require('./lib/tool');
var comm = require("./lib/comm");
var request = require('request');
var fs = require('fs');  

var Protocol = require("protobufjs").protoFromFile("proto/Protocol.proto").build("proto").MessageHandler;
var Data = require("protobufjs").protoFromFile("proto/Data.proto").build("proto");

var loginRequestData = new Data.LoginRequestData({"username":"test","password":"1234"});
var data=comm.protoEncode(loginRequestData,Protocol.LoginRequest);

console.log(data);

