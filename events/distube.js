const client = require("../index");

client.distube.on("initQueue", (queue, song) => {
	queue.volume = 10;
});
