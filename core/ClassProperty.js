/**
 * redis restore class 
 * save class with ClassEntity
 * @returns
 */
var ClassBase = require("./ClassBase").ClassBase;
var util = require("util");
function ClassProperty() {
	ClassBase.call(this);	
}
util.inherits(ClassEntity, ClassBase);
ClassProperty.prototype.prefix = function() {
	return "ClassEntity";
};
ClassProperty.prototype.field = function(name) {
	return "_"+this.prefix()+"_"+name;
};
ClassProperty.prototype.add = function(instance,func) {
	
};
ClassProperty.prototype.set = function(instance,func) {
	var values = [ instance.key() ];
	for ( var key in this) {
		if (typeof (this[key]) === "number"){
			if (parseInt(this[key])>=0){
				values.push("_"+this.prefix()+"_"+key);
				values.push(parseInt(this[key]));
			}
		}else if(typeof (this[key]) === "string") {
			values.push("_"+this.prefix()+"_"+key);
			values.push(this[key]);
		}
	}
	this.redis.hmset(values, func);
};

ClassProperty.prototype.get = function(instance,func) {
	var temp=this;
	this.redis.hgetall(instance.key(),function(err, reply) {
		if (!reply)
			return func(err, reply);
		for (key in temp) {
			var tkey="_"+temp.prefix()+"_"+key;	
			if (reply[tkey]!=null){				
				if (typeof (temp[key]) === "number")
					temp[key] = parseInt(reply[tkey]);
				else if (typeof (temp[key]) === "string")
					temp[key] = reply[tkey];				
			}
		}
		for (key in reply) {
			if (instance[key]!=null){
				if (typeof (instance[key]) === "number")
					instance[key] = parseInt(reply[key]);
				else if (typeof (instance[key]) === "string")
					instance[key] = reply[key];
			}
		}
		func(err, reply);
	});
};
ClassProperty.prototype.incrProperty = function(instance,name,num,func) {
	instance.incrProperty(this.field(name), num, func);
};
ClassProperty.prototype.decrProperty = function(instance,name,num,func) {
	instance.decrProperty(this.field(name), num, func);
};
ClassProperty.prototype.setProperty = function(instance,name,num,func) {
	instance.setProperty(this.field(name), num, func);
};

exports.ClassProperty = ClassProperty;