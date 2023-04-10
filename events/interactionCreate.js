const client = require("../index");

client.on("interactionCreate", async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		await command.execute(interaction, client).catch(() => {});
	} else {
		return;
	}
});
