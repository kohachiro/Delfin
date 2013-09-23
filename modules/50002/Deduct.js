var Gold = require("./Gold").Gold;
var util = require("util");

function Deduct() {
	Gold.call(this);	
}
util.inherits(Deduct, Gold);
Deduct.prototype.prefix = function() {
	return "Deduct";
};
exports.Deduct = Deduct;