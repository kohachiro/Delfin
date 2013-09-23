var ClassEntity = require("../../core/ClassEntity").ClassEntity;
var util = require("util");
var tool = require('../../core/tool');
function User() {
	ClassEntity.call(this);
	this.score = 0;
}
util.inherits(User, ClassEntity);
User.prototype.prefix = function() {
	return "User";
};
User.prototype.getlistKey = function(userid) {
	return userid + ":FriendList";
};
User.prototype.add = function(userid,func) {
	this.getRedis().hset(this.getlistKey(userid), this.name, this.id, this.set(func));
};
User.prototype.getList = function(func) {
	if (!this.id)
		func(new Error("id Not initialized."), null);
	this.getRedis().hgetall(this.getlistKey(this.id), function(err, reply) {
		if (err||!reply)
			func(error, null);
		func(null, reply);
	});
};
User.prototype.getALL = function(func) {
	var temp=this;
	temp.getList(function(err, reply) {	
		var r=[];
		if (!reply||reply.length==0)
			return func(err,null);
		var names=Object.keys(reply);
		var count=0;
		var next = function() {
			var obj=tool.clone(temp);
			obj.id=reply[names[count]];
			obj.name=names[count];
			obj.get(function(err, re){
				if(re)
					r.push(obj);
				count++;				
				if (count < names.length)
					next();
				else{
					r.push(temp);
					func(err,r);
				}
			});
		};
		next();
	});	
};
exports.User = User;