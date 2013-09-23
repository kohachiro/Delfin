global.redis = {};

var service = require('../serviceSlots');
redis[50002] = 
	require("redis").createClient(6379,"localhost");

var config = require('../config');
var comm = require('../comm');
var tool = require('../../../core/tool');

var Protocol = require("protobufjs").protoFromFile("./modules/50002/proto/Protocol.proto").build("proto").MessageHandler;
var Data = require("protobufjs").protoFromFile("./modules/50002/proto/Data.proto").build("proto");

//var registerRequestData = new Data.RegisterRequestData({"username":"test","password":"1234"});
//service.assign(null,comm.protoEncode(registerRequestData,Protocol.RegisterRequest));

//var loginRequestData = new Data.LoginRequestData({"username":"test","password":"1234"});
//service.assign(null,comm.protoEncode(loginRequestData,Protocol.LoginRequest));

//var addPlayerRequestData = new Data.AddPlayerRequestData({"token":"8IrK6KeV","userid":"hYUzr9YCD6k3KP300eiJ","playername":"jjkk"});
//service.assign(null,comm.protoEncode(addPlayerRequestData,Protocol.AddPlayerRequest));

//var logoutRequestData = new Data.LogoutRequestData({"token":"8IrK6KeV","userid":"hYUzr9YCD6k3KP300eiJ"});
//service.assign(null,comm.protoEncode(logoutRequestData,Protocol.LogoutRequest));

//var goldPoolRequestData = new Data.GoldPoolRequestData({"token":"8IrK6KeV","userid":"hYUzr9YCD6k3KP300eiJ","playerid":"8t4GfISFhmg2evFtbdRd"});
//service.assign(null,comm.protoEncode(goldPoolRequestData,Protocol.GoldPoolRequest));

//var rewardPoolRequestData = new Data.RewardPoolRequestData({"token":"8IrK6KeV","userid":"hYUzr9YCD6k3KP300eiJ","playerid":"8t4GfISFhmg2evFtbdRd","double":1});
//service.assign(null,comm.protoEncode(rewardPoolRequestData,Protocol.RewardPoolRequest));

//var deductRequestData = new Data.DeductRequestData({"token":"8IrK6KeV","userid":"hYUzr9YCD6k3KP300eiJ","playerid":"8t4GfISFhmg2evFtbdRd"});
//service.assign(null,comm.protoEncode(deductRequestData,Protocol.DeductRequest));

//var updateGoldRequestData = new Data.UpdateGoldRequestData({"token":"8IrK6KeV","userid":"hYUzr9YCD6k3KP300eiJ","playerid":"8t4GfISFhmg2evFtbdRd"});
//service.assign(null,comm.protoEncode(updateGoldRequestData,Protocol.UpdateGoldRequest));

//var updateRewardRequestData = new Data.UpdateRewardRequestData({"token":"8IrK6KeV","userid":"hYUzr9YCD6k3KP300eiJ","playerid":"8t4GfISFhmg2evFtbdRd","reward":["UGMr","gHME"],"deduct":["yCUN","Fkcu"]});
//service.assign(null,comm.protoEncode(updateRewardRequestData,Protocol.UpdateRewardRequest));



