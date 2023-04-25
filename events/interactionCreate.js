const { EmbedBuilder } = require("discord.js");
const client = require("../index");

client.on("interactionCreate", async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		await command.execute(interaction, client);
	}
	if (interaction.isAutocomplete()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		await command.autocomplete(interaction, client).catch(() => {});
	}
});
