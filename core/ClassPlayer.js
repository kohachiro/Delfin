var ClassEntity = require("./ClassEntity").ClassEntity;
var util = require("util");
var tool = require('./tool');

function ClassPlayer() {
	ClassEntity.call(this);
	this.userid = "";
}
util.inherits(ClassPlayer, ClassEntity);
ClassPlayer.prototype.prefix = function() {
	return "Player";
};
ClassPlayer.prototype.userKey = function() {
	return this.userid + ":User";
};
ClassPlayer.prototype.listKey = function() {
	return this.userid + ":PlayerList";
};
ClassPlayer.prototype.add = function(func) {
	this.id = tool.mdString(this.name);
	var temp = this;
	this.getRedis().hset(temp.listKey(), temp.name, temp.id, function(err, reply) {
		temp.set(func);
	});
};
ClassPlayer.prototype.list = function(func) {
	if (this.userid === 0)
		func(new Error("userid Not initialized."), null);
	this.getRedis().hgetall(this.listKey(), function(err, reply) {
		if (err||!reply)
			func(err, null);
		func(null, reply);
	});
};
exports.ClassPlayer = ClassPlayer;
