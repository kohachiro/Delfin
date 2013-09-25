var ClassEntity = require("./ClassEntity").ClassEntity;
var util = require("util");

function ClassUser() {
	ClassEntity.call(this);
	this.password = "";
}
util.inherits(ClassUser, ClassEntity);
ClassUser.prototype.prefix = function(obj) {
	return "User";
};
exports.ClassUser = ClassUser;