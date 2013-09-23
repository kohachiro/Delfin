var crypto = require('crypto');

function clone(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return obj;
    } 
    var c = obj instanceof Array ? [] : {}; 
    for (var i in obj) {
        var prop = obj[i]; 
        if (typeof prop == 'object') {
           if (prop instanceof Array) {
               c[i] = []; 
               for (var j = 0; j < prop.length; j++) {
                   if (typeof prop[j] != 'object') {
                       c[i].push(prop[j]);
                   } else {
                       c[i].push(clone(prop[j]));
                   }
               }
           } else {
               c[i] = clone(prop);
           }
        } else {
           c[i] = prop;
        }
    } 
    return c;
}
function md5(str) {
	var ret = crypto.createHash('md5').update(str).digest("hex");
	return ret;
}
function time33(str) {
	var len = str.length();
	var hash = 0;
	for ( var i = 0; i < len; i++)
		hash = (hash << 5) + hash + str.charCodeAt(i);
	return hash;
}
function getTimeHour(hour) {
	var date = new Date();
	date.setHours(date.getDate() + hour);
	var D = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var h = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
	return  D +"." + h;
}
function getTime(time) {
	var date;
	if (time>0)
		date = new Date(time);
	else
		date = new Date();
	var _M = date.getMonth() + 1;
	var M = _M > 9 ? _M : "0" + _M;
	var D = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var h = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
	var m = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
	var s = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();

	return date.getFullYear() + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
}
function getUnixTime() {
	return parseInt(new Date().getTime()/1000);
}
function randString(bits) {
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqretuvwxyz0123456789_=";	
	var ret = '';
	for (var i = 0; i<bits; i++){
		rand = Math.floor(Math.random() * 64);// 32-bit integer
		ret += chars [rand];
	}
	return ret;
}
function base64(d) {
	var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqretuvwxyz0123456789_=";
	var h = table.charAt(d & 0x3F);
	while (d >= 0x3F) {
		d = parseInt(d / table.length);
		h += table.charAt(d & 0x3F);
	}
	return h;
}
function mdString(s) {
	var md = md5(s);
	var md1 = md.substring(0, 12);
	var md2 = md.substring(12, 24);
	var md3 = md.substring(24, 30);
	return base64(parseInt(md1, 16)) + base64(parseInt(md2, 16))
			+ base64(parseInt(md3, 16));
}
function random(max,min) {
	return new Number(Math.random() * (max-min)+min).toFixed(0);
}
function isString(str, cmp) {
	if (str&&typeof (str) === "string"&&str !== cmp)
		return true;
	return false;
}
function isNumber(str, cmp) {
	str = parseInt(str);
	if (str !== "NaN" && str >= cmp)
		return true;
	return false;
}
function isHashMap(obj, cmp) {
	if (typeof(obj)==="object"&&Object.keys(obj)&&Object.keys(obj).length>=cmp)
		return true;
	return false;
}
function isArray(obj, cmp) {
	if (typeof(obj)==="object"&&obj.length>=cmp)
		return true;
	return false;
}
function benchmark(title, funk) {
	var end, i, start;
	start = new Date();
	for (i = 0; i < 5000; i++) {
		funk();
	}
	end = new Date();
	console.log(title + ': ' + (end - start) + 'ms');
}
function getKeyByValue(json,value) {
	for ( var key in json) {
		if ( json[key]===value ){
			return key;
		}
	}
}
function jsonResponse(response, code, data) {
	if (data!==null)
		code["data"] = data;
	if (response !== null) {
		response.writeHead(200, {"Content-Type" : "text/plain"});
		response.write(JSON.stringify(code));
		response.end();
	} else {
		console.log(JSON.stringify(code));
	}
}

function signature() {
	var string = "";
	for ( var i = 1; i < arguments.length; i++) {
		string += arguments[i];
	}
	str = string + 'g@bkf9n+g=*pdc!+_^6#@=-ls&i^y+mz1v!-_hxf%^76(@bd9#';
	var ret = crypto.createHash('md5').update(str).digest("hex");
	console.log(ret);
	console.log(arguments[0]);
	if (ret === arguments[0])
		return true;
	return false;
}
function log(data) {
	console.log(JSON.stringify(data));
}
function requestLog(request, data) {
	if (!request)
		return console.log("POST:" + data);
	console.log(request.connection.remoteAddress + ' - - ['
			+ new Date().toUTCString() + '] "POST '
			+ require("url").parse(request.url).pathname + ' HTTP/1.1" 200 - '
			+ data.replace(/\n/g, ""));
}
exports.md5 = md5;
exports.log = log;
exports.clone = clone;
exports.random = random;
exports.getTime = getTime;
exports.isArray = isArray;
exports.isString = isString;
exports.isNumber = isNumber;
exports.mdString = mdString;
exports.isHashMap = isHashMap;
exports.signature = signature;
exports.benchmark = benchmark;
exports.requestLog = requestLog;
exports.randString = randString;
exports.getUnixTime = getUnixTime;
exports.getTimeHour = getTimeHour;
exports.jsonResponse = jsonResponse;
exports.getKeyByValue = getKeyByValue;


