const client = require("../index");

client.on("guildMemberRemove", async (member) => {
	const channelRootID = "997190073802031204";
	const removeChannel = client.channels.cache.get(channelRootID);
	await removeChannel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle(`👋 | Adios de ${member.guild.name}`)
				.setDescription(
					`\`\`\`${member.user.tag} ha sido removido del servidor\`\`\``,
				)
				.setThumbnail(member.displayAvatarURL())
				.setColor("Random")
				.setTimestamp()
				.setFooter({
					text: `Traido a ti por ${client.user.username}`,
					iconURL: client.user.displayAvatarURL(),
				}),
		],
	});
});
