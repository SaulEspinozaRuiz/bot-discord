const { EmbedBuilder } = require("discord.js");
const client = require("../index");

client.on("guildMemberAdd", async (member) => {
	const channelRootID = "1044816703797854278";
	const roleRootID = "1042301131377872907";
	const welcomeChannel = client.channels.cache.get(channelRootID);
	await member.roles.add(roleRootID);
	await welcomeChannel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle(`👋 | Bienvenido a ${member.guild.name}`)
				.setDescription(
					`\`\`\`${member.user.tag} Se ha unido al servidor\`\`\``,
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
