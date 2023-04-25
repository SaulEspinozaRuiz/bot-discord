const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("musica")
		.setDescription("🎶 | Comandos de musica")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("play")
				.setDescription("▶️ | Reproducir musica")
				.addStringOption((option) =>
					option
						.setName("musica")
						.setDescription(
							"🎶 | Musica a reproducir a traves de nombre o enlace",
						)
						.setRequired(true)
						.setAutocomplete(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("stop")
				.setDescription("🎶 | Detener la reproduccion de musica"),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("pause").setDescription("🎶 | Pausar la musica"),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("resume")
				.setDescription("🎶 | Reaunudar la reproduccion de musica"),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("skip")
				.setDescription("🎶 | Saltarse a la siguiente cancion de la lista"),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("previous")
				.setDescription(
					"🎶 | Reproducir la cancion anterior de la lista actual",
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("jump")
				.setDescription("🎶 | Saltarse una cancion de la lista actual")
				.addIntegerOption((option) =>
					option
						.setName("numero")
						.setDescription(
							"🎶 | Numero de la cancion en la cola a la que quieras saltar",
						)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("volume")
				.setDescription("🎶 | Cambiar el volumen de la reproduccion de musica")
				.addIntegerOption((option) =>
					option
						.setName("volumen")
						.setDescription(
							"🎶 | Nuevo volumen (No se recomienda cambiar este valor que por defecto es 10)",
						)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("loop")
				.setDescription("🎶 | Establece el modo de repeticion"),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("nowplaying")
				.setDescription(
					"🎶 | Mostrar informacion de la cancion en reproduccion",
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("queue")
				.setDescription(
					"🎶 | Mostrar informacion de la cola de reproduccion actual",
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("autoplay")
				.setDescription(
					"🎶 | Activar o desactivar el modo de reproduccion automatica",
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("filters")
				.setDescription(
					"🎶 | Activar un filtro para la reproduccion de la musica",
				)
				.addStringOption((option) =>
					option
						.setName("filtro")
						.setDescription("📝 | Filtro a seleccionar")
						.setRequired(true)
						.addChoices(
							{ name: "💠 | 3D", value: "3d" },
							{ name: "💠 | BassBoost", value: "bassboost" },
							{ name: "💠 | Echo", value: "echo" },
							{ name: "💠 | Karaoke", value: "karaoke" },
							{ name: "💠 | Nightcore", value: "nightcore" },
							{ name: "💠 | Vaporwave", value: "vaporwave" },
							{ name: "💠 | Flanger", value: "flanger" },
							{ name: "💠 | Gate", value: "gate" },
							{ name: "💠 | Haas", value: "haas" },
							{ name: "💠 | Reverse", value: "reverse" },
							{ name: "💠 | Surround", value: "surround" },
							{ name: "💠 | MCompand", value: "mcompand" },
							{ name: "💠 | Phaser", value: "phaser" },
							{ name: "💠 | Tremolo", value: "tremolo" },
							{ name: "💠 | EarWax", value: "earwax" },
							{ name: "💠 | Desactivado", value: "off" },
						),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("lyrics")
				.setDescription("🎶 | Enseñar la letra de la cancion actual"),
		),
	async autocomplete(interaction, client) {
		const focusedValue = interaction.options.getFocused();
		const choices = (
			await client.distube.search(focusedValue, { limit: 25 })
		).map((song) => ({
			name:
				song.name.length > 100
					? `🎵 | ${song.name.slice(0, 92)}...`
					: `🎵 | ${song.name}`,
			value: song.url,
		}));
		return interaction.respond(choices).catch(() => {});
	},
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
		if (
			interaction.guild.members.me.voice.channelId &&
			interaction.guild.members.me.voice.channelId !==
				interaction.member.voice.channelId
		) {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle(
							"❌ | No te encuentras en el mismo canal de voz que yo para poder usar este comando",
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
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "play") {
			const query = interaction.options.getString("musica");
			client.distube.play(interaction.member.voice.channel, query, {
				textChannel: interaction.channel,
				member: interaction.member,
			});
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("▶️ | Reproducciendo musica")
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}

		const queue = await client.distube.getQueue(interaction);
		if (!queue) {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("❌ | No hay reproduccion de musica en este momento")
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		if (subcommand === "stop") {
			await client.distube.stop(interaction);
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("⏹️ | Se paro la reproduccion de musica")
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		if (subcommand === "pause") {
			if (queue.paused) {
				queue.resume();
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("⏯️ | Reanudando la reproduccion de musica")
							.setColor("Random")
							.setTimestamp()
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			}
			queue.pause();
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("⏸️ | Pausando la reproduccion de musica")
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		if (subcommand === "resume") {
			if (queue.paused) {
				queue.resume();
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("⏯️ | Reanudando la reproduccion de musica")
							.setColor("Random")
							.setTimestamp()
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			}
			queue.pause();
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("⏸️ | Pausando la reproduccion de musica")
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		if (subcommand === "skip") {
			try {
				await client.distube.skip(interaction);
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("⏩ | Saltando a al siguiente cancion")
							.setColor("Random")
							.setTimestamp()
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			} catch {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("❌ | No hay una siguiente cancion a la que saltar")
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
		if (subcommand === "previous") {
			try {
				await client.distube.previous(interaction);
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("⏪ | Reproduciendo la cancion anterior")
							.setColor("Random")
							.setTimestamp()
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			} catch {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("❌ | No hay una anterior cancion a la que retroceder")
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
		if (subcommand === "jump") {
			const num = interaction.options.getInteger("numero");
			try {
				await client.distube.jump(interaction, num);
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("#️⃣ | Saltando a la cancion seleccionada")
							.setColor("Random")
							.setTimestamp()
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			} catch {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle(
								"❌ | Numero invalido y/o ocurrio un error al momento de saltar",
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
		}
		if (subcommand === "volume") {
			const num = interaction.options.getInteger("volumen");
			if (volume < 1 || volume > 100) {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("❌ | Numero invalido para cambiar de volumen")
							.setColor("Random")
							.setTimestamp()
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			}
			try {
				await client.distube.setVolume(interaction, num);
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("🔢 | Cambiando el volumen al seleccionado")
							.setColor("Random")
							.setTimestamp()
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			} catch {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle(
								"❌ | Numero invalido y/o ocurrio un error al momento de cambiar el volumen",
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
		}
		if (subcommand === "loop") {
			let mode = client.distube.setRepeatMode(interaction);
			mode = mode
				? mode === 2
					? "🔁 | Repetir cola de reproduccion"
					: "🔂 | Repetir cancion actual"
				: "❌ | Desactivado el modo de repeticion";
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle(`${mode}`)
						.setColor("Random")
						.setTimestamp()
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		if (subcommand === "nowplaying") {
			const song = queue.songs[0];
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("🎵 | Reproduciendo ahora mismo")
						.setAuthor({
							name: "Reproduciendo ahora",
							iconURL: song.thumbnail,
							url: song.url,
						})
						.setDescription(`** [${song.name}](${song.streamURL}) **`)
						.addFields([
							{
								name: "** ⌛ | Duracion **",
								value: ` \`${queue.formattedCurrentTime}/${song.formattedDuration} \``,
								inline: true,
							},
							{
								name: "** 👤 | Solicitado por **",
								value: ` \`${song.user.tag} \``,
								inline: true,
							},
							{
								name: "** 🗣️ | Autor **",
								value: ` \`${song.uploader.name}\``,
								inline: true,
							},
						])
						.setThumbnail(song.thumbnail)
						.setColor("Random")
						.setFooter({
							text: `Traido a ti por ${client.user.username}`,
							iconURL: client.user.displayAvatarURL(),
						}),
				],
			});
		}
		if (subcommand === "queue") {
			try {
				const song = queue.songs[1];
				const q = queue.songs
					.map((song, i) => {
						return `${
							i === 0 ? "Reproduciendo:" : `${i}.`
						} ${song.name} - \`${song.formattedDuration}\``;
					})
					.join("\n");
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("🎵 | Reproduciendo ahora mismo")
							.setDescription(`**Lista actual: ** \n\n  ${q}`)
							.setThumbnail(song.thumbnail)
							.setColor("Random")
							.setFooter({
								text: `Traido a ti por ${client.user.username}`,
								iconURL: client.user.displayAvatarURL(),
							}),
					],
				});
			} catch {
				return interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("❌ | No hay queue en modo de reproduccion automatica")
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
		if (subcommand === "autoplay") {
			const mode = client.distube.toggleAutoplay(interaction);
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("🎦 | Reproduccion automatica")
						.setDescription(
							"Modo de reproduccion automatica `" +
								(mode ? "Activado" : "Desactivado") +
								"`",
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
		if (subcommand === "filters") {
			const filter = interaction.options.getString("filtro");
			try {
				if (filter === "off") {
					queue.filters.clear();
					interaction.followUp({
						embeds: [
							new EmbedBuilder()
								.setTitle("💠 | Filtros removidos")
								.setColor("Random")
								.setTimestamp()
								.setFooter({
									text: `Traido a ti por ${client.user.username}`,
									iconURL: client.user.displayAvatarURL(),
								}),
						],
					});
				} else {
					if (queue.filters.has(filter)) {
						queue.filters.remove(filter);
					} else {
						queue.filters.add(filter);
					}
					interaction.followUp({
						embeds: [
							new EmbedBuilder()
								.setTitle(`💠 | Filtros seleccionado ${filter}`)
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
							.setTitle("❌ | Ocurrio un error al implementar el filtro")
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
		if (subcommand === "lyrics") {
			const title = queue.songs[0].name;
			await axios
				.get(`https://some-random-api.ml/lyrics?title=${title}`)
				.then(async (d) => {
					return interaction.followUp({
						embeds: [
							new EmbedBuilder()
								.setTitle(`📝 | Letra de ${title}`)
								.setDescription(`${d.data.lyrics.slice(0, 4096)}`)
								.setColor("Random")
								.setTimestamp()
								.setFooter({
									text: `Traido a ti por ${client.user.username}`,
									iconURL: client.user.displayAvatarURL(),
								}),
						],
					});
				})
				.catch(() => {
					return interaction.followUp({
						embeds: [
							new EmbedBuilder()
								.setTitle("❌ | No se encontro la letra de la cancion")
								.setColor("Random")
								.setTimestamp()
								.setFooter({
									text: `Traido a ti por ${client.user.username}`,
									iconURL: client.user.displayAvatarURL(),
								}),
						],
					});
				});
		} else {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("❌ | Comando no implementado")
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
