const client = require("../index");

client.on("ready", () => {
	console.log(`\nLogged in as ${client.user.tag}!\n`.green);
});
