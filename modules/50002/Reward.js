var Gold = require("./Gold").Gold;
var util = require("util");

function Reward() {
	Gold.call(this);	
}
util.inherits(Reward, Gold);
Reward.prototype.prefix = function() {
	return "Reward";
};
exports.Reward = Reward;