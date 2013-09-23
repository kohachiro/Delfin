var ClassEntity = require("../../core/ClassEntity").ClassEntity;
var util = require("util");
var tool = require('../../core/tool');

function Player() {
	ClassEntity.call(this);
	this.userid = "";
	this.exp = 0;	
	this.gem = 5;
	this.gold = 3000;
	this.level = 0;	
	this.double = 0;
	this.lastGetGoldTime = 0;
	this.lastGetRewardTime = 0;
}
util.inherits(Player, ClassEntity);
Player.prototype.prefix = function() {
	return "Player";
};
Player.prototype.userKey = function() {
	return this.userid + ":User";
};
Player.prototype.listKey = function() {
	return this.userid + ":PlayerList";
};
Player.prototype.add = function(func) {
	this.id = tool.mdString(this.name);
	var temp = this;
	this.getRedis().hset(temp.listKey(), temp.name, temp.id, function(err, reply) {
		temp.set(func);
	});
};
Player.prototype.list = function(func) {
	if (this.userid === 0)
		func(new Error("userid Not initialized."), null);
	this.getRedis().hgetall(this.listKey(), function(err, reply) {
		if (err||!reply)
			func(err, null);
		func(null, reply);
	});
};
exports.Player = Player;
