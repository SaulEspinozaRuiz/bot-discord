const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("voz")
		.setDescription("🔊 | Comandos para los canales de voces generados")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("nombre")
				.setDescription("🔊 | Cambiar el nombre de tu canal de voz")
				.addStringOption((option) =>
					option
						.setName("nombre")
						.setDescription("📝 | Nuevo nombre del canal de voz generado")
						.setRequired(true),
				),
		),
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });
		if (!interaction.member.voice.channel) {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle(
							"❌ | No te encuentras en un canal de voz para poder usar este comando",
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
		const voiceChannel = interaction.member.voice.channel;
		const ownedChannel = client.voiceGenerator.get(interaction.member.id);
		if (!ownedChannel || voiceChannel.id !== ownedChannel) {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("❌ | No eres dueño del canal de voz")
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "nombre") {
			const newName = interaction.options.getString("nombre");
			if (newName.length > 22 || newName.length < 1) {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle(
								"❌ | Nombre no puede exceder de los 22 o menos 1 de caracteres",
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
			voiceChannel.edit({ name: newName });
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("📝 | Cambio de nombre")
						.setDescription(
							`El canal ${voiceChannel} cambio de nombre a ${newName}`,
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
