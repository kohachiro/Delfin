var User = require("./User").User;
var Top = require("./Top").Top;
var code = require('../../core/code');
var tool = require('../../core/tool');
var server = require('./server');

function addFriend(request, response, postData) {
	tool.requestLog(request, postData);
	var post = JSON.parse(postData);		
	if (!post || !tool.isString(post.userid, "")
			|| !tool.isString(post.username, "")
			|| !tool.isArray(post.friend, 1)
			|| !tool.isString(post.signature, ""))
		return tool.jsonResponse(response,code.nullParameter);
	if (!tool.signature(post.signature, post.userid, post.username,post.friend))
		return tool.jsonResponse(response, code.signatureInvalid);
	var userid = post.userid;
	var friends=post.friend;
	var count=0;
	var user = new User();
	user.config=server.config.service;
	user.id=post.userid;	
	user.name=post.username;	
	var next = function(func){
		var friend = new User();
		friend.config=server.config.service;		
		friend.init(friends[count]);
		friend.get(function(err, reply) {
			if (!reply){
				friend.add(userid, function(err, reply) {
					user.add(friend.id, function(err, reply) {
						count++;
						if (count < friends.length)
							next(func);
					});
				});
			}else{
				count++;
				if (count < friends.length)
					next(func);
			}
		});
		return func; 
	};
	
	user.get(function(err, reply) {
		if (!reply)
			user.set(next(tool.jsonResponse(response, code.success)));
		else
			next(tool.jsonResponse(response, code.success));
	});

}

function setScore(request, response, postData) {
	tool.requestLog(request, postData);	
	var post = JSON.parse(postData);		
	if (!post || !tool.isString(post.userid, "")
			|| !tool.isString(post.username, "")
			|| !tool.isNumber(post.score, 0)
			|| !tool.isString(post.signature, ""))
		return tool.jsonResponse(response,code.nullParameter);
	if (!tool.signature(post.signature, post.userid, post.username,post.friend))
		return tool.jsonResponse(response, code.signatureInvalid);
	var user = new User();
	user.config=server.config.service;	
	user.id=post.userid;	
	user.name=post.username;
	user.score=post.score;
	user.set(function(err, reply) {
		var top = new Top();
		top.config=server.config.service;
		top.set(user.name,user.score,function(err, reply) {
			return tool.jsonResponse(response, code.success);
		});
	});
}

function friendTop(request, response, postData) {
	tool.requestLog(request, postData);	
	var post = JSON.parse(postData);	
	if (!post || !tool.isString(post.userid, ""))
		return tool.jsonResponse(response,code.nullParameter);
	var user = new User();
	user.config=server.config.service;
	user.id=post.userid;
	user.get(function(err, re) {
		user.getALL(function(err, reply) {
			reply.sort(function(a,b){
				return b.score-a.score;
			});
			return tool.jsonResponse(response,code.success, reply.slice(0,20));
		});
	});
		
}

function topList(request, response, postData) {
	tool.requestLog(request, postData);	
	var top = new Top();
	top.config=server.config.service;
	top.get(function(err, reply) {
		return tool.jsonResponse(response,code.success, reply.slice(0,50));
	});
}

exports.friendTop = friendTop;
exports.addFriend = addFriend;
exports.setScore = setScore;
exports.topList = topList;
