const { ChannelType } = require("discord.js");
const client = require("../index");

client.on("voiceStateUpdate", async (oldState, newState) => {
	const channelRootID = "1044767536773877800";
	if (
		oldState.channel !== newState.channel &&
		newState.channel &&
		newState.channel.id === channelRootID
	) {
		const existingChannel = client.voiceGenerator.get(oldState.member.id);
		if (existingChannel) {
			oldState.channel.delete().catch(() => {});
		}
		const voiceChannel = await oldState.guild.channels.create({
			name: `『🔊』 | Canal de ${oldState.member.user.tag}`,
			type: ChannelType.GuildVoice,
			parent: newState.channel.parent,
			permissionOverwrites: [
				{
					id: oldState.member.id,
					allow: ["Connect", "ManageChannels"],
				},
				{
					id: oldState.guild.id,
					allow: ["Connect"],
				},
			],
			userLimit: 10,
		});
		client.voiceGenerator.set(oldState.member.id, voiceChannel.id);
		await newState.channel.permissionOverwrites.edit(oldState.member, {
			Connect: false,
		});
		return setTimeout(() => {
			oldState.member.voice.setChannel(voiceChannel);
		}, 200);
	}
	const joinToCreateChannel = client.voiceGenerator.get(oldState.member.id);
	const members = oldState.channel?.members
		.filter((m) => !m.user.bot)
		.map((m) => m.id);
	if (
		joinToCreateChannel &&
		oldState.channel.id === joinToCreateChannel &&
		(!newState.channel || newState.channel.id !== joinToCreateChannel)
	) {
		if (members.length > 0) {
			const randomID = members[Math.floor(Math.random() * members.length)];
			const randomMember = oldState.guild.members.cache.get(randomID);
			randomMember.voice.setChannel(oldState.channel).then((v) => {
				oldState.channel.setName(randomMember.user.username).catch((e) => null);
				oldState.channel.permissionOverwrites.edit(randomMember, {
					Connect: true,
					ManageChannels: true,
				});
			});
			client.voiceGenerator.set(oldState.member.id, null);
			client.voiceGenerator.set(randomMember.id, oldState.channel.id);
		} else {
			client.voiceGenerator.set(oldState.member.id, null);
			oldState.channel.delete().catch((e) => null);
		}
	}
});
