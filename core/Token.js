var tool = require('./tool');

function Token() {	
	this.config=null;	
	this.userid = "";
	this.token = "";
}
Token.prototype.getRedis = function() {
	return redis[this.config.port];
};
Token.prototype.expire = function() {
	return 10000;
};
Token.prototype.prefix = function() {
	return "Token";
};
Token.prototype.key = function() {
	return this.userid + ":" + this.prefix();
};
Token.prototype.init = function(obj) {
	for ( var key in arg)
		if (typeof (this[key]) === "number")
			this[key] = parseInt(arg[key]);
		else if ( typeof (this[key]) === "string") 
			this[key] = arg[key];
};
Token.prototype.get = function(func) {
	var temp = this;
	temp.getRedis().get(temp.key(), function(err, reply) {
		if (reply)
			temp.token = reply;
		func(err, reply);
		temp.getRedis().expire(temp.key(), temp.expire());
	});
};
Token.prototype.set = function(func) {
	if (this.token === "")
		this.gen();
	this.getRedis().set(this.key(), this.token, func);
	this.getRedis().expire(this.key(), this.expire());
};
Token.prototype.del = function() {
	this.getRedis().del(this.key());
};
Token.prototype.gen = function() {
	this.token = tool.randString(8);
};

exports.Token = Token;