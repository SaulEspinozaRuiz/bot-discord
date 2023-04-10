const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("miscelaneos")
		.setDescription("📌 | Comandos misceláneos")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("ping")
				.setDescription("🏓 | Muestra el ping del bot y de la API de Discord."),
		),
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "ping") {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("🏓 | Pong!")
						.setDescription(
							`🤖 | Ping del bot: \`${
								client.ws.ping
							}ms\`\n📡 | Ping de la API de Discord: \`${
								Date.now() - interaction.createdTimestamp
							}ms\``,
						)
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
	},
};
