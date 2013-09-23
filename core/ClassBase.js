/**
 * redis restore a class
 * function only 
 * @returns
 */
function ClassBase() {
	this.config=null;
}
ClassBase.prototype.getRedis = function() {
	return redis[this.config.port];
};
ClassBase.prototype.key = function() {
	return "";
};
ClassBase.prototype.init = function(arg) {
	for ( var key in arg) 
		if (typeof (this[key]) === "number")
			this[key] = parseInt(arg[key]);
		else if ( typeof (this[key]) === "string") 
			this[key] = arg[key];
};
ClassBase.prototype.has = function(func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);
	if (this.key() === "")
		func(new Error("key Not initialized."), null);	
	this.getRedis().exists(this.key(), func);
};
ClassBase.prototype.set = function(func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);	
	if (this.key() === "")
		func(new Error("key Not initialized."), null);
	var values = [ this.key() ];
	for ( var key in this) {
		if (typeof (this[key]) === "number"
			|| typeof (this[key]) === "string") {
			values.push(key);
			values.push(this[key]);
		}
	}
	this.getRedis().hmset(values, func);
};

ClassBase.prototype.get = function(func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);	
	if (this.key() === "")
		func(new Error("key Not initialized."), null);	
	var keys = [];
	for ( var key in this)
		if (typeof (this[key]) !== "function")
			keys.push(key);
	var temp = this;
	this.getRedis().hmget(this.key(), keys, function(err, reply) {
		if (!reply||!reply[1])
			return func(err, null);
		for ( var i = 0; i < keys.length; i++) {
			if (typeof (temp[keys[i]]) === "number")
				temp[keys[i]] = parseInt(reply[i]);
			else if ( typeof (temp[keys[i]]) === "string") 
				temp[keys[i]] = reply[i];
		}
		func(err, reply);
	});
};
ClassBase.prototype.del = function(func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);		
	if (this.key() === "")
		func(new Error("key Not initialized."), null);
	this.getRedis().del(this.key(),func);
};
ClassBase.prototype.delProperty = function(name, func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);		
	if (this.key() === "")
		func(new Error("key Not initialized."), null);	
	var temp = this;
	this.getRedis().hdel(this.key(), name,  function(err, reply) {
		temp[name] = null;
		return func(err, reply);
	});
};
ClassBase.prototype.setProperty = function(name, num, func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);		
	if (this.key() === "")
		func(new Error("key Not initialized."), null);	
	var temp = this;
	this.getRedis().hset(this.key(), name, num, function(err, reply) {
		if (reply>=0&&temp[name]!=null)
			temp[name] = reply;
		return func(err, reply);
	});
};

ClassBase.prototype.getProperty = function(name, func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);		
	if (this.key() === "")
		func(new Error("key Not initialized."), null);	
	var temp = this;
	this.getRedis().hget(this.key(), name, function(err, reply) {
		if (reply>=0&&temp[name]!=null)
			temp[name] = reply;
		return func(err, reply);
	});
};

ClassBase.prototype.getPropertyClass = function() {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);		
	if (this.key() === "")
		func(new Error("key Not initialized."), null);	
	var temp=this;
	var func=arguments[arguments.length-1];
	var args=arguments;
	this.getRedis().hgetall(this.key(),function(err, reply) {
		if (!reply)
			return func(err, reply);
		for ( var i = 0; i < args.length-1; i++) {
			var obj=args[i];			
			for (key in obj) {
				var tkey=":"+obj.prefix()+":"+key;	
				if (reply[tkey]!=null){				
					if (typeof (obj[key]) === "number")
						obj[key] = parseInt(reply[tkey]);
					else if (typeof (obj[key]) === "string")
						obj[key] = reply[tkey];				
				}
			}
		}
		for (key in temp) {
			if (reply[key]!=null){
				if (typeof (temp[key]) === "number")
					temp[key] = parseInt(reply[key]);
				else if (typeof (temp[key]) === "string")
					temp[key] = reply[key];
			}
		}
		func(err, reply);
	});		
};

ClassBase.prototype.incrProperty = function(name, num, func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);		
	if (this.key() === "")
		func(new Error("key Not initialized."), null);
	if (typeof(num) !== "number")
		func(new Error("num Not a number."), null);	
	var temp = this;
	this.getRedis().hincrby(this.key(), name, num, function(err, reply) {
		console.log("incr "+name +":"+num +"/"+ reply);
		if (reply>=0&&temp[name]!=null)
			temp[name] = reply;		
		return func(err, reply);
	});
};
ClassBase.prototype.decrProperty = function(name, num, func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);
	if (this.key() === "")
		func(new Error("key Not initialized."), null);	
	var temp = this;
	temp.incrProperty(name, -num, function(err, reply) {
		if (reply < 0){
			temp.incrProperty(name, num, function(e, re) {	
				if (re>=0)
					func(err, reply);
				else
					func(new Error("lose " + num + " " + name + "."), null);
			});
		}else{
			if (reply>=0&&temp[name]!=null)
				temp[name] = reply;
			func(err, reply);
		}
	});
};
ClassBase.prototype.atomicDecr = function(arr,func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);
	if (this.key() === "")
		func(new Error("key Not initialized."), null);		
	console.log(arr);
	var temp=this;
	var rollBack={};
	var count=0;
	var keys=Object.keys(arr);
	var pass=function(err,reply){
		count++;
		if (count < keys.length)
			next();
		else
			func(err,reply);
	};
	var next=function(){
		if (arr[keys[count]]===0)
			return pass(null,"Skip");
		temp.decrProperty(keys[count],arr[keys[count]],function(err, reply) {
			if (count===0&&reply<0)
				return func(err,"Negative");
			if (reply<0)
				return temp.atomicRollback(rollBack,func);
			rollBack[keys[count]]=arr[keys[count]];		
			pass(err,reply);
		});		
	};
	next();
};
ClassBase.prototype.atomicRollback = function(arr,func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);
	if (this.key() === "")
		func(new Error("key Not initialized."), null);		
	var temp=this;
	var keys=Object.keys(arr);
	var count=0;
	var next=function(){
		temp.incrProperty(keys[count],arr[keys[count]],function(err, reply) {
			count++;	
			if (count < keys.length)
				next();
			else
				return func(err,"Negative");
		});		
	};
	next();
};
ClassBase.prototype.atomicIncr = function(arr,func) {
	if (!this.getRedis())
		func(new Error("redis Not initialized."), null);
	if (this.key() === "")
		func(new Error("key Not initialized."), null);		
	var temp=this;
	var count=0;
	var keys=Object.keys(arr);
	var pass=function(err,reply){
		count++;
		if (count < keys.length)
			next();
		else
			func(err,reply);
	};	
	var next=function(){
		if (arr[keys[count]]===0)
			return pass(null,"OK");
		temp.incrProperty(keys[count],arr[keys[count]],function(err, reply) {
			pass(err,reply);
		});		
	};
	next();
};

exports.ClassBase = ClassBase;