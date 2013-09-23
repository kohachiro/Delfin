/**
 * redis restore class 
 * with prototype id and name
 * @returns
 */
var ClassBase = require("./ClassBase").ClassBase;
var util = require("util");
var tool = require('./tool');


function ClassEntity() {
	ClassBase.call(this);	
	this.id = "";
	this.name = "";
}
util.inherits(ClassEntity, ClassBase);
ClassEntity.prototype.prefix = function() {
	return "ClassEntity";
};
ClassEntity.prototype.key = function() {
	if (this.id === "" && this.name !== "")
		this.id = tool.mdString(this.name);	
	return this.id + ":" + this.prefix();
};
ClassEntity.prototype.add = function(func) {
	if (this.id === "" && this.name !== "")
		this.id = tool.mdString(this.name);	
	this.set(func);
};
exports.ClassEntity = ClassEntity;