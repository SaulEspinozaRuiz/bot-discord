console.clear();

const { Client, Collection } = require("discord.js");
const { APIs, StringUtils } = require("devtools-ts");
const { readdirSync } = require("fs");
const colors = require("colors");

console.log("Initializing...\n".yellow);
const client = new Client({ intents: [131071] });

client.config = require("./settings/config.js");
client.commands = new Collection();
client.voiceGenerator = new Collection();

module.exports = client;

readdirSync("./handlers/").forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});

client
	.login(client.config.token)
	.catch((err) =>
		console.log(`\n[ERROR] ~ Failed to login to Discord: \n${err.stack}\n`.red),
	);
