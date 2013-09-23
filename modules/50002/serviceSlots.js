var User = require("../../core/User").User;
var Token = require("../../core/Token").Token;
var Gold = require("./Gold").Gold;
var Reward = require("./Reward").Reward;
var Deduct = require("./Deduct").Deduct;
var Player = require("./Player").Player;

var server = require('./server');
var config = require('./config');
var comm = require('./comm');
var tool = require('../../core/tool');
var Protocol = require("protobufjs").protoFromFile("./modules/50002/proto/Protocol.proto").build("proto").MessageHandler;
var Data = require("protobufjs").protoFromFile("./modules/50002/proto/Data.proto").build("proto");

function assign( response, putData )  {
	console.log(putData);
	var protoID = putData.readInt16BE(0);
	var length = putData.readInt16BE(2);
	var data = putData.slice(4, length+4);
	var funcname = tool.getKeyByValue( Protocol, protoID );
	tool.log( {"proto":funcname,"length":length,"data":JSON.stringify(data)} );
	var post = Data[funcname+"Data"].decode(data);
	this[funcname]( response, post );
		

}


/**
 * proto message LoginRequest
 * @param response http response
 * @param post	http post
 * @returns
 */
function LoginRequest(response, post) {
	if (!post || !post.username || !tool.isString(post.username, ""))
		return ErrorResponse(response,Data.ReturnStatus.nullParameter);
	var user = new User();
	user.config = server.config.service;
	user.name = post.username;
	user.init(post);	
	user.get(function(err, reply) {
		if (!reply)
			return ErrorResponse(response, Data.ReturnStatus.error);
		if (tool.md5(post.password) !== user.password)
			return ErrorResponse(response, Data.ReturnStatus.fail);
		LoginResponse(response, user);
	});
}
/**
 * proto message LogoutRequest
 * @param response http response
 * @param post	http post
 * @returns
 */
function LogoutRequest(response, post) {
	if (!post || !tool.isString(post.userid, "") 
			|| !tool.isString(post.token, ""))
		return ErrorResponse(response,Data.ReturnStatus.nullParameter);
	var token = new Token();
	token.config = server.config.service;
	token.userid = post.userid;
	token.get(function(err, reply) {
		if (token.token === post.token){
			token.del();
			return ErrorResponse(response,Data.ReturnStatus.success);
		}else{
			ErrorResponse(response,Data.ReturnStatus.notFound);
		}
	});
}
/**
 * proto message RegisterRequest
 * @param response http response
 * @param post	http post
 * @returns
 */
function RegisterRequest(response, post) {
	if (!post || !tool.isString(post.username, "")
			|| !tool.isString(post.password, ""))
		return ErrorResponse(response,Data.ReturnStatus.nullParameter);
	post.password = tool.md5(post.password);
	var user = new User();
	user.config = server.config.service;
	user.name = post.username;
	user.init(post);
	user.has(function(err, reply) {	
		if (err)
			return ErrorResponse(response,Data.ReturnStatus.error);
		else if (reply)
			return ErrorResponse(response,Data.ReturnStatus.alreadyExist);
		RegisterResponse(response,user);
	});
}
/**
 * proto message AddPlayerRequest
 * @param response http response
 * @param post	http post
 * @returns
 */
function AddPlayerRequest(response, post) {
	if (!post || !tool.isString(post.userid, "")
			|| !tool.isString(post.token, "")
			|| !tool.isString(post.playername, ""))
		return ErrorResponse(response, Data.ReturnStatus.fail);
	if (post.playername.length > 90 || post.playername.length === "")
		return ErrorResponse(response, Data.ReturnStatus.invalidname);
	comm.isLogin(post.userid, post.token, function(ret) {
		if (!ret)
			return ErrorResponse(response,Data.ReturnStatus.expired);
		var player = new Player();
		player.config=server.config.service;
		player.name = post.playername;
		player.init(post);
		player.id = tool.mdString(player.name);
		player.userid = post.userid;
		player.has(function(err, reply) {
			if (err)
				return ErrorResponse(response,Data.ReturnStatus.failed);
			if (reply)
				return ServerResponse(response,Data.ReturnStatus.alreadyExist,player.userid);
			AddPlayerResponse(response, player);
		});
	});
}
/**
 * proto message GoldPoolRequest
 * @param response http response
 * @param post	http post
 * @returns
 */
function GoldPoolRequest(response, post) {
	if (!post || !tool.isString(post.userid, "")
			|| !tool.isString(post.token, "")
			|| !tool.isString(post.playerid, ""))
		return ErrorResponse(response,Data.ReturnStatus.nullParameter);
	comm.isLogin(post.userid, post.token, function(ret) {
		if (!ret)
			return ErrorResponse(response,Data.ReturnStatus.notLogin);
		var player = new Player();
		player.config=server.config.service;
		player.id = post.playerid;
		player.get(function(err, reply) {
			if (!reply)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			if (player.userid !== post.userid)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			GoldPoolResponse(response,player);
		});
	});
}
/**
 * proto message RewardPoolRequest
 * @param response http response
 * @param post	http post
 * @returns
 */
function RewardPoolRequest(response, post) {
	if (!post || !tool.isString(post.userid, "")
			|| !tool.isString(post.token, "")
			|| !tool.isString(post.playerid, ""))
		return ErrorResponse(response,Data.ReturnStatus.nullParameter);	
	comm.isLogin(post.userid, post.token, function(ret) {
		if (!ret)
			return ErrorResponse(response,Data.ReturnStatus.notLogin);
		var player = new Player();
		player.config = server.config.service;
		player.id = post.playerid;
		player.get(function(err, reply) {
			if (!reply)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			if (player.userid !== post.userid)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			RewardPoolResponse(response,player);
		});
	});
}
/**
 * proto message DeductRequest
 * @param response http response
 * @param post	http post
 * @returns
 */
function DeductRequest(response, post) {
	if (!post || !tool.isString(post.userid, "")
			|| !tool.isString(post.token, "")
			|| !tool.isString(post.playerid, ""))
		return ErrorResponse(response,Data.ReturnStatus.nullParameter);	
	comm.isLogin(post.userid, post.token, function(ret) {
		if (!ret)
			return ErrorResponse(response,Data.ReturnStatus.notLogin);
		var player = new Player();
		player.config = server.config.service;
		player.id = post.playerid;
		player.get(function(err, reply) {
			if (!reply)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			if (player.userid !== post.userid)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			DeductResponse(response,player);
		});
	});
}
/**
 * proto message DeductRequest
 * @param response http response
 * @param post	http post
 * @returns
 */
function UpdateGoldRequest(response, post) {
	if (!post || !tool.isString(post.userid, "")
			|| !tool.isString(post.token, "")
			|| !tool.isString(post.playerid, ""))
		return ErrorResponse(response,Data.ReturnStatus.nullParameter);	
	comm.isLogin(post.userid, post.token, function(ret) {
		if (!ret)
			return ErrorResponse(response,Data.ReturnStatus.notLogin);
		var player = new Player();
		player.config = server.config.service;
		player.id = post.playerid;
        /*player.set(function(err,lastGetGoldTime){
            lastGetGoldTime = tool.getUnixTime();
        });*/
		player.get(function(err, reply) {
			if (!reply)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			if (player.userid !== post.userid)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			var gold = new Gold();
			gold.config = server.config.service;
			gold.id = player.id;
			gold.get(function(err, reply) {
				if (!reply)
					return ErrorResponse(response,Data.ReturnStatus.notFound);
				var time = tool.getTimeHour(0);
				var replyNumber=reply[time];
				if (!replyNumber)
					return ServerResponse(response,Data.ReturnStatus.doubleSubmit,player.userid);
				var incr=[];
				if (replyNumber >config.goldConfig.max){
					incr["gold"] = parseInt(replyNumber.substring(0,replyNumber.indexOf(".")));
					incr["gem"] = parseInt(replyNumber.substring(replyNumber.indexOf(".")+1));
				}else{
					incr["gold"]=parseInt(replyNumber);
				}
				console.log(incr);
				player.atomicIncr(incr,function(err, reply) {
					if (!reply)
						return ErrorResponse(response,Data.ReturnStatus.error);	
					gold.delProperty(time,function(err, reply) {
						if (!reply)
							return ErrorResponse(response,Data.ReturnStatus.error);
                        player.setProperty("lastGetGoldTime",tool.getUnixTime(),function(err, reply) {
                            return ServerResponse(response,Data.ReturnStatus.success,player.userid);
                        });
                    });
				});
			});
		});
	});
}
/**
 * proto message UpdateRewardRequest
 * @param response http response
 * @param post	http post
 * @returns
 */
function UpdateRewardRequest(response, post) {
	if (!post || !tool.isString(post.userid, "")
			|| !tool.isString(post.token, "")
			|| !tool.isString(post.playerid, "")
			|| !tool.isArray(post.reward, 1))
		return ErrorResponse(response,Data.ReturnStatus.nullParameter);	
	comm.isLogin(post.userid, post.token, function(ret) {
		if (!ret)
			return ErrorResponse(response,Data.ReturnStatus.notLogin);
		var player = new Player();
		player.config = server.config.service;
		player.id = post.playerid;
		player.get(function(err, reply) {
			if (!reply)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			if (player.userid !== post.userid)
				return ErrorResponse(response,Data.ReturnStatus.notFound);
			var reward = new Reward();
			reward.config = server.config.service;
			reward.id = player.id;
			reward.get(function(err, rewardPool) {
				if(!rewardPool||Object.keys(rewardPool).length<=0)
					return ErrorResponse(response,Data.ReturnStatus.notFound);
				for (var i=0;i<post.reward.length;i++)
					if (!rewardPool[post.reward[i]])
						return ServerResponse(response,Data.ReturnStatus.doubleSubmit,player.userid);

				var deduct = new Deduct();
				deduct.config = server.config.service;
				deduct.id = player.id;
				deduct.get(function(err, deductPool) {
					if(!reply||Object.keys(reply).length<=0)
						return ErrorResponse(response,Data.ReturnStatus.notFound);
					for (var i=0;i<deductPool.length;i++)
						if (!deductPool[post.deduct[i]])
							return ServerResponse(response,Data.ReturnStatus.doubleSubmit,player.userid);
					
					var index = 0;
					var addReward = function() {
						if (index < post.reward.length){
							var rewardKey=post.reward[index];
							player.incrProperty("gold",parseInt(rewardPool[rewardKey]),function(err, reply) {
								if (!reply)
									return ErrorResponse(response,Data.ReturnStatus.error);
								reward.delProperty(rewardKey,function(err, reply) {
									index++;
									addReward();
								});
							});
						}else{
							var total = 0;
							for (var i=0;i<post.deduct.length;i++)
								total +=parseInt(deductPool[post.deduct[i]]);
							if (total>0){
								player.decrProperty("gold",total,function(err, reply) {
									if (!reply)
										return ErrorResponse(response,Data.ReturnStatus.error);
									return DeductResponse(response,player);
								});
							}else{
								return DeductResponse(response,player);
							}
						}
					};
					addReward();
				});
			});
		});
	});
}
/**
 * proto message LoginResponse
 * @param response http response
 * @param user	user instance
 * @returns
 */
function LoginResponse(response, user) {
	var data = new Data.LoginResponseData();
	data.user = getUserProto(user);
	data.time = tool.getUnixTime();
	//var players = getPlayers(user);
	var temp = new Player();
	temp.config = server.config.service;
	temp.userid = user.id;
	temp.list(function(err, reply) {
		if (!reply||Object.keys(reply).length==0){
			
			return comm.tokenResponse(response,data,Protocol.LoginResponse,user.id);
		}
		var keys = Object.keys(reply);
		var count = 0;
		var next = function() {
			var player=new Player();
			player.config = server.config.service;
			player.id = reply[keys[count]];	
			player.userid = user.id;
			player.get(function(err, reply){
				data.player.push(getPlayerProto(player));	
				count++;
				if (count < keys.length){
					next();
				}else{

					comm.tokenResponse(response,data,Protocol.LoginResponse,user.id);
				}
			});
		};
		next();
	});	

}
/**
 * proto message AddPlayerResponse
 * @param response http response
 * @param user	user instance
 * @returns
 */
function RegisterResponse(response, user) {
	user.add(function(err, reply) {
		if (!reply)
			return ServerResponse(response,Data.ReturnStatus.fail,null);
		var data = new Data.RegisterResponseData();
		data.user = getUserProto(user);
		data.time = tool.getUnixTime();
		comm.tokenResponse(response,data,Protocol.RegisterResponse,user.id);
	});
}
/**
 * proto message AddPlayerResponse
 * @param response http response
 * @param player	player instance
 * @returns
 */
function AddPlayerResponse(response, player) {
	player.add(function(err, reply) {
		if (!reply)
			return ServerResponse(response,Data.ReturnStatus.fail,player.userid);
		var data = new Data.AddPlayerResponseData();
		data.player = getPlayerProto(player);
		comm.tokenResponse(response,data,Protocol.AddPlayerResponse,player.userid);
	});
}
/**
 * proto message AddPlayerResponse
 * @param response http response
 * @param player	player instance
 * @returns
 */
function DeductResponse(response, player) {
	var deducts = [];
	var send = function(deductPool) {
		var data = new Data.DeductResponseData();
		data.deduct = deductPool;
		comm.tokenResponse(response,data,Protocol.DeductResponse,player.userid);	
	};		
	var deduct = new Deduct();
	deduct.config = server.config.service;
	deduct.id = player.id;	
	deduct.get(function(err, reply) {	
		//if(!reply||Object.keys(reply).length<=0){
			var pool = [];
			var x = 1;
			for(var i = 0;i<config.deductConfig.size;i++){
				var k = tool.randString(config.deductConfig.key_length);
				pool.push(k);
				deducts[k] = x;
				x = x*2;
			}
			deduct.add(deducts,function(err, reply) {
				if (!reply)
					return ErrorResponse(response,Data.ReturnStatus.notFound);
				send(pool);
			});			
		//}else{
		//	deducts=reply;
		//	send(Object.keys(reply));
		//}
	});
}
/**
 * proto message AddPlayerResponse
 * @param response http response
 * @param player	player instance
 * @returns
 */
function RewardPoolResponse(response, player) {
	var pool = [];
	var rewards = [];
	var total = 0;
	/**
	 * send function
	 */		
	var send=function(rewardPool) {
		var data = new Data.RewardPoolResponseData();
		data.pool = rewardPool;
		comm.tokenResponse(response,data,Protocol.RewardPoolResponse,player.userid);	
	};
	/**
	 * 	implement fill item into reward pool
	 */	
	var addItem=function(max,min) {
		var k=tool.randString(config.rewardConfig.key_length);
		var v;
		if (max === 0)
			v = min;
		else
			v = tool.random(max,min);
		pool.push(new Data.Reward({"id":k,"gold":v}));		
		rewards[k] = v;
		total = total + parseInt(v);
		return v;
	};
	/**
	 * fill value into reward pool
	 */
	var fillValue=function(limit) {
		for(var i=0;i<limit.count;i++){
			addItem(limit.max,limit.min);
		}
	};
	/**
	 * fill Mantissa into reward pool
	 */
	var fillMantissa=function(limit) {
		var pool = config.rewardConfig.total-total-limit.count*limit.min;
		console.log("low_level_left:"+pool);
		var count = 0;
		while( pool > 0 ){
			var v = addItem(limit.max,limit.min);
			pool = pool-(v-limit.min);
			count++;
		}
		if (limit.count>count){
			for(var i=0;i<limit.count-count;i++){
				addItem(0,limit.min);
			}
		}
		
		while(Object.keys(rewards).length<config.rewardConfig.size)
			addItem(0,limit.min);
	};	
	var reward = new Reward();
	reward.config = server.config.service;
	reward.id=player.id;
	reward.get(function(err, reply) {
		if(!reply||Object.keys(reply).length<=0){	
			for(var i=0;i<rewardConfig.length-1;i++){
				fillValue(config.rewardConfig[i]);
			}
			fillMantissa(config.rewardConfig[rewardConfig.length-1]);
			console.log("total:"+total);
			reward.add(rewards,function(err, reply) {
				if (!reply)
					return ErrorResponse(response,Data.ReturnStatus.notFound);
				send(pool);
			});			
		}else{
			Object.keys(reply).forEach(function(key) {
				pool.push(new Data.Reward({"id":key,"gold":reply[key]}));
			});
			send(pool);		
		}
	});
}
/**
 * proto message GoldPoolResponse
 * @param response http response
 * @param player	player instance
 * @returns
 */
function GoldPoolResponse(response, player) {
	var pool = [];
	var keys = [];
	var golds = [];	
	var gold = new Gold();
	gold.config = server.config.service;
	gold.id=player.id;
	gold.get(function(err, reply) {
		//if (reply&&reply[tool.getTimeHour(1)])
			//return ServerResponse(response,Data.ReturnStatus.notReady,player.userid);
		gold.del(function(err, reply) {
			for(var i=0;i<config.goldConfig.size;i++){
				var k=tool.getTimeHour(i);
				var v=tool.random(config.goldConfig.max,config.goldConfig.min);
				pool.push(new Data.Gold({"id":k,"gold":v}));
				golds[k]=v;
				keys[i]=k;
			}
			//fill a big reward gold
			var randKey=tool.random(0,config.goldConfig.size);
			var randtime=keys[randKey];
			var randGold=tool.random(0,config.goldConfig.length-1);
			golds[randtime]=config.goldConfig[randGold].gold+"."+config.goldConfig[randGold].gem;
            pool[randKey].gold = golds[randtime];

			gold.add(golds,function(err, reply) {
				if (!reply)
					return ErrorResponse(response,Data.ReturnStatus.notFound);
                var data = new Data.GoldPoolResponseData();
				data.pool = pool;
				comm.tokenResponse(response,data,Protocol.GoldPoolResponse,player.userid);
			});
		});
	});
}
/**
 * proto message ServerResponse
 * @param response http response
 * @param code	return code
 * @param userid 
 */
function ServerResponse(response, code, userid) {
	tool.log({ "code":tool.getKeyByValue(Data.ReturnStatus,code) });
	var data = new Data.ServerResponseData();
	data.code = code;
	comm.tokenResponse(response,data,Protocol.ServerResponse,userid);
}
/**
 * proto message ErrorResponse
 * @param response http response
 * @param code	return code
 */
function ErrorResponse(response, code) {
	tool.log({ "code":tool.getKeyByValue(Data.ReturnStatus,code) });
	var data = new Data.ErrorResponseData();
	data.code = code;	
	comm.binResponse(response,data,Protocol.ErrorResponse);
}
/**
 * transform form  user to proto.Data.User
 * @param user
 * @returns {Data.User}
 */
function getUserProto(user) {
	var userProto = new Data.User({"id":user.id,"name":user.name});
	return userProto;
}
/**
 * transform form player to proto.Data.Player
 * @param player
 * @returns {Data.Player}
 */
function getPlayerProto(player) {
	var playerProto = new Data.Player({"id":player.id,"name":player.name,"gem":player.gem,"gold":player.gold,"level":player.level,"exp":player.exp,"lastGetGoldTime":player.lastGetGoldTime,"lastGetRewardTime":player.lastGetRewardTime});
	return playerProto;
}
/**
 * get player list
 * @param user
 */
function getPlayers(user) {
	var r=[];
	var temp=new Player();
	temp.userid=user.id;
	temp.list(function(err, reply) {
		if (!reply||Object.keys(reply).length==0)
			return r;
		var keys=Object.keys(reply);
		var count=0;
		var next = function() {
			var player=new Player();
			player.id=reply[keys[count]];
			player.userid=user.id;
			player.get(function(err, reply){
				r.push(player);	
				count++;
				if (count < keys.length){
					next();
				}else{
					return r;
				}
			});
		};
		next();
	});
}

exports.assign = assign;
exports.LoginRequest = LoginRequest;
exports.LogoutRequest = LogoutRequest;
exports.ErrorResponse = ErrorResponse;
exports.ErrorResponse = ErrorResponse;
exports.DeductRequest = DeductRequest;
exports.RegisterRequest = RegisterRequest;
exports.GoldPoolRequest = GoldPoolRequest;
exports.AddPlayerRequest = AddPlayerRequest;
exports.RewardPoolRequest = RewardPoolRequest;
exports.RewardPoolRequest = RewardPoolRequest;
exports.UpdateGoldRequest = UpdateGoldRequest;
exports.UpdateRewardRequest = UpdateRewardRequest;