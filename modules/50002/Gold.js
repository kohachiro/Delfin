var ClassEntity = require("../../core/ClassEntity").ClassEntity;
var util = require("util");

function Gold() {
	ClassEntity.call(this);
}
util.inherits(Gold, ClassEntity);
Gold.prototype.prefix = function() {
	return "Gold";
};
Gold.prototype.has = function(key,func) {
	if (this.id === 0)
		func(new Error("id Not initialized."), null);
	this.getRedis().hexists(this.key(),key, func);
};
Gold.prototype.size = function(func) {
	this.getRedis().hlen(this.key(),func);
};
Gold.prototype.add = function(object,func) {
	var values = [ this.key() ];
	for ( var key in object) {
		if (typeof (object[key]) === "number"
			|| typeof (object[key]) === "string") {
			values.push(key);
			values.push(object[key]);
		}
	}
	this.getRedis().hmset(values, func);
};
Gold.prototype.get = function(func) {
	this.getRedis().hgetall(this.key(),func);
};
exports.Gold = Gold;