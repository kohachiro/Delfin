/**
 * redis restore class 
 * with a list
 * @returns
 */
var ClassBase = require("./ClassBase").ClassBase;
var util = require("util");
var tool = require('./tool');
function ClassInstance() {
	ClassBase.call(this);		
	this.playerid = "";
	this.id = "";
}
util.inherits(ClassInstance, ClassBase);
ClassInstance.prototype.prefix = function() {
	return "ClassInstance";
};
ClassInstance.prototype.key = function() {
	return this.playerid + "_" + this.prefix() + "_" + this.id;
};
ClassInstance.prototype.playerKey = function() {
	return this.playerid + ":Player";
};
ClassInstance.prototype.incrField = function() {
	return "_Increment" + "_" + this.prefix();
};
ClassInstance.prototype.listField = function() {
	return this.playerid + ":" + this.prefix() + "List";
};
ClassInstance.prototype.incr = function(func) {
	this.getRedis().hincrby(this.playerKey(), this.incrField(), 1, func);
};
ClassInstance.prototype.getList = function(func) {
	if (this.playerid === "")
		return func(new Error("playerid Not initialized."), null);
	this.getRedis().hgetall(this.listField(),function(err, reply) {
		var ret=[];
		for (key in reply)
			ret.push(reply[key]);		
		func(err,ret);		
	});
};
ClassInstance.prototype.has = function(key,func) {
	if (this.playerid === "")
		return func(new Error("playerid Not initialized."), null);	
	this.getRedis().hexists(this.listField(),key, func);
};
ClassInstance.prototype.add = function(listFieldKey,func) {
	if (this.playerid === "")
		return func(new Error("playerid Not initialized."), null);
	var temp = this;
	var set=function(name,func) {
		this.getRedis().hset(this.listField(), name, temp.id,function(err, reply) {
			if ( err || !reply )
				return func(new Error("list error."), "positionUsed");
			temp.set(func);
		});
	};
	if (temp.id > 0){
		set(temp.id,func);
	}else{
		temp.incr(function(err, reply) {
			if (err || !reply || typeof (reply) !== "number")
				return func(new Error("incr error."), null);
			temp.id = reply;
			var name = listFieldKey;
			if (!listFieldKey)
				name=temp.id;
			set(name,func);
		});		
	}
};
ClassInstance.prototype.del = function(key,func) {
	if (this.id === 0)
		return func(new Error("id Not initialized."), null);
	if (this.playerid === "")
		return func(new Error("playerid Not initialized."), null);
	var listkey=this.listField();
	var temp=this;
	this.getRedis().del(this.key(), function(err, reply) {
		if (err||!reply)
			return  func(err, reply);
		temp.getRedis().hdel(listkey,key,func) ;
	});
};
ClassInstance.prototype.getALL = function(func) {
	var temp=this;
	temp.getList(function(err, reply) {	
		var r=[];
		if (!reply||reply.length==0)
			return func(err,null);
		var count=0;
		var next = function() {
			var obj=tool.clone(temp);
			obj.id=parseInt(reply[count]);
			obj.playerid=temp.player_d;
			obj.get(function(err, re){
				if(re)
					r.push(obj);
				count++;
				if (count < reply.length)
					next();
				else
					func(err,r);
			});
		};
		next();		
	});	
};
exports.ClassInstance = ClassInstance;

