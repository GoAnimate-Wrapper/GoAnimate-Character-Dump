require('dotenv').config();
const fs = require('fs');
const gather = require('./gather');
const rekt = require('./gitRekt');

const args = process.argv.slice(2);
const startEnv = process.env.START_OVERRIDE || process.env.START;
const endEnv = process.env.END_OVERRIDE || process.env.END;

console.log('Starting script.');
rekt.init().then(() => {
	var charList = fs.readdirSync('characters').sort();
	var start = args[1] || startEnv, end = args[2] || endEnv;

	switch (args[0]) {
		case 'up':
			start = charList.length ?
				charList[charList.length - 1].
					substring(0, 9) : startEnv;
			end = endEnv;
			break;
		case 'down':
			start = charList.length ? charList[0].
				substring(0, 9) : endEnv;
			end = startEnv;
			break;
		case 'range':
			start = charList[0].substring(0, 9);
			end = startEnv;
			break;
		default:
			if (!args.length) break;
			args.map(v => Number.parseInt(v)).
				filter(v => !isNaN(v)).
				forEach(v => gather(v, v));
			return;
	}
	gather(Number.parseInt(start), Number.parseInt(end));
});