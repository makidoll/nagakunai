var express = require("express"); 
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var fs = require("fs");

// Express
app.use(express.static(global.DIR+"/node_modules/socket.io-client/dist"));

app.get("/chat", function(req, res) {
	res.send(fs.readFileSync(global.DIR+"/site/chat.html", "utf8"));
});

app.get("*", function(req, res) {
	res.send(fs.readFileSync(global.DIR+"/site/main.html", "utf8"));
});

// Socket.io
var users = {};

io.on("connection", function(socket) {

	socket.on("room", function(id) {
		
		if (!users[id]) users[id] = {}; 
		let user_id = "";

		socket.on(id+"-user", function(user) {
			users[id][user.id] = {name: user.name, color: user.color};
			user_id = user.id;
			io.emit(id+"-user", users[id]);
		});

		socket.on(id+"-message", function(data) {
			io.emit(id+"-message", data);
		});

		socket.on("disconnect", function() {
			delete users[id][user_id];
			io.emit(id+"-user", users[id]);
		});

	});

});

module.exports = {
	start: function() {

		server.listen(global.port, function() {
			global.log("Web server started on *:"+global.port);
		});

	}
}