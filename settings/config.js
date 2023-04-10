require("dotenv").config();

module.exports = {
	token: process.env.DISCORD_TOKEN || "YOUR TOKEN HERE",
	clientID: process.env.DISCORD_CLIENT_ID || "YOUR CLIENT ID HERE",
};
