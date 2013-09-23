var ClassEntity = require("./ClassEntity").ClassEntity;
var util = require("util");

function User() {
	ClassEntity.call(this);
	this.password = "";
}
util.inherits(User, ClassEntity);
User.prototype.prefix = function(obj) {
	return "User";
};
exports.User = User;