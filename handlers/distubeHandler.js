const { DeezerPlugin } = require("@distube/deezer");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { DisTube } = require("distube");

module.exports = (client) => {
	client.distube = new DisTube(client, {
		emitNewSongOnly: false,
		leaveOnEmpty: true,
		leaveOnFinish: true,
		leaveOnStop: false,
		savePreviousSongs: true,
		emitAddListWhenCreatingQueue: false,
		emitAddSongWhenCreatingQueue: false,
		nsfw: true,
		emptyCooldown: 25,
		ytdlOptions: {
			highWaterMark: 1024 * 1024 * 64,
			quality: "highestaudio",
			format: "audioonly",
			liveBuffer: 60000,
			dlChunkSize: 1024 * 1024 * 4,
		},
		plugins: [
			new DeezerPlugin(),
			new SoundCloudPlugin(),
			new SpotifyPlugin({
				parallel: true,
				emitEventsAfterFetching: true,
			}),
			new YtDlpPlugin(),
		],
	});
};
