var ClassPlayer = require("../../core/ClassPlayer").ClassPlayer;
var util = require("util");

function Player() {
	ClassPlayer.call(this);
	this.userid = "";
	this.exp = 0;	
	this.gem = 5;
	this.gold = 3000;
	this.level = 0;	
}
util.inherits(Player, ClassPlayer);
Player.prototype.prefix = function() {
	return "Player";
};

exports.Player = Player;
