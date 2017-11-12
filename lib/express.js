var express = require("express"); 
var fs = require("fs");
var app = express();

module.exports = {
	start: function() {

		app.get("/chat", function(req, res) {
			res.send(fs.readFileSync(global.DIR+"/site/chat.html", "utf8"));
		});

		app.get("*", function(req, res) {
			res.send(fs.readFileSync(global.DIR+"/site/main.html", "utf8"));
		});

		app.listen(global.port, function() {
			global.log("Web server started on *:"+global.port);
		});

	}
}