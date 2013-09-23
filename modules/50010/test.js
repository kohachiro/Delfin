global.redis = {};
var server = require('./server');
var service = require('./serviceTopList');
redis[server.config.service.port] = 
	require("redis").createClient(server.config.redis.port,server.config.redis.url);

//curl -i -d '{"userid":"XXeFvJfnBm3MD2Y2Wd8o","username":"ooxx","friend":[{"id":"hYUzr9YCD6k3KP300eiJ","name":"bbb"},{"id":"ldHtDcVV0W0BK1k$m6bU","name":"ccc"}],"signature":"d776728f82133158502844b596be5d3b"}'  http://localhost:18889/addFriend
var obj='{"userid":"XXeFvJfnBm3MD2Y2Wd8o","username":"ooxx","friend":[{"id":"hYUzr9YCD6k3KP300eiJ","name":"bbb"},{"id":"ldHtDcVV0W0BK1k$m6bU","name":"ccc"}],"signature":"d776728f82133158502844b596be5d3b"}';
service.addFriend(null,null,obj);


//curl -i -d '{"userid":"XXeFvJfnBm3MD2Y2Wd8o","username":"ooxx","score":"130","signature":"709ac8be597b7b6d61c0ebab1d075340"}'  http://localhost:18889/setScore
//var obj='{"userid":"XXeFvJfnBm3MD2Y2Wd8o","username":"ooxx","score":"130","signature":"709ac8be597b7b6d61c0ebab1d075340"}';
//service.setScore(null,null,obj);

//curl -i -d '{"userid":"XXeFvJfnBm3MD2Y2Wd8o"}'  http://localhost:18889/friendTop
//var obj='{"userid":"XXeFvJfnBm3MD2Y2Wd8o"}';
//service.friendTop(null,null,obj);

//curl  http://localhost:18889/topList
//var obj='';
//service.topList(null,null,obj);

