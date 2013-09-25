var ClassUser = require("../../core/ClassUser").ClassUser;
var util = require("util");

function User() {
	ClassUser.call(this);
}
util.inherits(User, ClassUser);
User.prototype.prefix = function() {
	return "User";
};

exports.User = User;
