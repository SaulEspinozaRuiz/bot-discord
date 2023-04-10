const { REST, Routes } = require("discord.js");
const { readdirSync } = require("fs");
const commands = [];
let f = 0;

module.exports = async (client) => {
	const rest = new REST({ version: "10" }).setToken(client.config.token);
	readdirSync("./commands/").forEach((file) => {
		try {
			const command = require(`../commands/${file}`);
			commands.push(command.data.toJSON());
			client.commands.set(command.data.name, command);
		} catch (err) {
			f++;
			console.log(
				`\n[ERROR] ~ Failed to load command ${file}!\n(${err})\n`.red,
			);
		}
	});
	(async () => {
		try {
			const data = await rest.put(
				Routes.applicationCommands(client.config.clientID),
				{ body: commands },
			);
			console.log(
				`[INFO] ~ Successfully registered ${data.length} commands and ${f} failed to load!`
					.magenta,
			);
		} catch (error) {
			console.log(`\n[ERROR] ~ Failed to register commands!\n(${error})\n`.red);
		}
	})();
};
