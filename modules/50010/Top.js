var ClassBase = require("../../core/ClassBase").ClassBase;
var util = require("util");
function Top() {
	
}
util.inherits(Top, ClassBase);
Top.prototype.key = function() {
	return "Top";
};
Top.prototype.set = function(key,value,func) {
	var temp=this;

	temp.get(function(err, reply) {
		if (!reply)
			return temp.getRedis().hset(temp.key(),key,value, func);
		
		reply.push({"name":key,"value":value});
		reply.sort(function(a,b){
			return b.value-a.value;
		});
		temp.getRedis().hdel(temp.key(),function(err,re) {
			var tmp=reply.slice(0,50);
			var values = [ temp.key() ];
			for(var i=0;i<tmp.length;i++){
				values.push(tmp[i].name);
				values.push(tmp[i].value);
			}
			temp.getRedis().hmset(values, func);
		});
	
	});
};

Top.prototype.get = function(func) {
	var object=[];
	this.getRedis().hgetall(this.key(),function(err,reply) {
		if( Object.keys(reply).length === 0 )
			return func(err, null);
		Object.keys(reply).forEach(function(key) {
			object.push({"name":key,"value":reply[key]});
		});
		object.sort(function(a,b){
			return b.value-a.value;
		});
		func(err, object);
	});
};
exports.Top = Top;