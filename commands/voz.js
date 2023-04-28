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
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("acceso")
				.setDescription("🔊 | Ofrecer acceso a tu canal de voz a un miembro")
				.addUserOption((option) =>
					option
						.setName("usuario")
						.setDescription("👤 | Seleccionar al miembro que quieras añadir")
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("remover")
				.setDescription("🔊 | Remueve a alguien el acceso a tu canal de voz")
				.addUserOption((option) =>
					option
						.setName("usuario")
						.setDescription("👤 | Seleccionar al miembro que quieras remover")
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("estado")
				.setDescription("🔊 | Hacer tu canal de voz publico o privado")
				.addStringOption((option) =>
					option
						.setName("modo")
						.setDescription("📝 | Publico o privado")
						.setRequired(true)
						.addChoices(
							{ name: "🔓 | Publico", value: "public" },
							{ name: "🔒 | Privado", value: "private" },
						),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("limite")
				.setDescription(
					"🔊 | Cambiar el limite de personas permitidas en el canal de voz",
				)
				.addIntegerOption((option) =>
					option
						.setName("numero")
						.setDescription("📝 | Introduce el nuevo limite de miebros (2/99)")
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("bitrate")
				.setDescription("🔊 | Cambiar el bitrate del canal de voz")
				.addIntegerOption((option) =>
					option
						.setName("numero")
						.setDescription("📝 | Nuevo valor del bitrate (8/384)")
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("propietario")
				.setDescription(
					"🔊 | Comparte los derechos del canal a otro usario dentro del mismo canal",
				)
				.addUserOption((option) =>
					option
						.setName("usuario")
						.setDescription("👤 | Nuevo dueño del canal de voz")
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
		if (subcommand === "acceso") {
			const targetMember = interaction.options.getMember("usuario");
			voiceChannel.permissionOverwrites.edit(targetMember, { Connect: true });
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("👤 | Usuario con acceso activado")
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		if (subcommand === "remover") {
			const targetMember = interaction.options.getMember("usuario");
			voiceChannel.permissionOverwrites.edit(targetMember, { Connect: false });
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("👤 | Usuario con acceso desactivado")
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		if (subcommand === "estado") {
			const state = interaction.options.getString("modo");
			try {
				if (state === "public") {
					voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
						Connect: true,
					});
					return interaction.followUp({
						embeds: [
							new EmbedBuilder()
								.setTitle("🔓 | Cambio de estado a publico el canal de voz")
								.setColor("Random")
								.setTimestamp()
								.setFooter({
									text: `Traido a ti por ${client.user.username}`,
									iconURL: client.user.displayAvatarURL(),
								}),
						],
					});
				} else if (state === "private") {
					voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
						Connect: false,
					});
					return interaction.followUp({
						embeds: [
							new EmbedBuilder()
								.setTitle("🔒 | Cambio de estado a privado el canal de voz")
								.setColor("Random")
								.setTimestamp()
								.setFooter({
									text: `Traido a ti por ${client.user.username}`,
									iconURL: client.user.displayAvatarURL(),
								}),
						],
					});
				} else {
					return interaction.followUp({
						embeds: [
							new EmbedBuilder()
								.setTitle("❌ | Ocurrio un error al cambiar el estado")
								.setColor("Random")
								.setTimestamp()
								.setFooter({
									text: `Traido a ti por ${client.user.username}`,
									iconURL: client.user.displayAvatarURL(),
								}),
						],
					});
				}
			} catch {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("❌ | Ocurrio un error al cambiar el estado")
							.setColor("Random")
							.setTimestamp()
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			}
		}
		if (subcommand === "limite") {
			const num = interaction.options.getInteger("numero");
			if (num < 2 || num > 99) {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("❌ | El valor tiene que estar en el rango de 2/99")
							.setColor("Random")
							.setTimestamp()
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			}
			await voiceChannel.setUserLimit(num);
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle(
							`✅ | El canal ahora tiene el limite de ${num} de miembros`,
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
		if (subcommand === "bitrate") {
			const num = interaction.options.getInteger("numero");
			if (num < 8 || num > 384) {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle(
								"❌ | El valor tiene que estar en el rango de 8/384 de bitrate permitido",
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
			await voiceChannel.setBitrate(`${num}00`);
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle(`✅ | El valor del bitrate ahora es de ${num}`)
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		if (subcommand === "propietario") {
			const targetUser = interaction.options.getUser("usuario");
			await voiceChannel.permissionOverwrites.edit(targetUser, {
				Connect: true,
				ManageChannels: true,
			});
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle(`✅ | Se le concencio los derechos a ${targetUser}`)
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
