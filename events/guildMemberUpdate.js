const client = require("../index");

client.on("guildMemberUpdate", async (oldMember, newMember) => {
	const channelRootID = "1044764854252216391";
	const boostRoleID = "1045556168052973628";
	const boostChannel = client.channels.cache.get(channelRootID);
	if (
		!oldMember.roles.cache.has(boostRoleID) &&
		newMember.roles.cache.has(boostRoleID)
	) {
		await boostChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle(`💹 | ${member.guild.name} ha sido boosteado`)
					.setDescription(
						`\`\`\`${member.user.tag} ha contribuido al servidor\`\`\``,
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
	}
});
