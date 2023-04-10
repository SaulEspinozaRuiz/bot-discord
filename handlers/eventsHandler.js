const { readdirSync } = require("fs");
let s = 0;
let f = 0;

module.exports = async (client) => {
	readdirSync("./events/").forEach((event) => {
		try {
			require(`../events/${event}`);
			s++;
		} catch (err) {
			console.log(
				`\n[ERROR] ~ Failed to load event ${event}:\n${err.stack}\n`.red,
			);
			f++;
		}
	});
	console.log(
		`[INFO] ~ Loaded ${s} events, failed to load ${f} events.`.magenta,
	);
};
