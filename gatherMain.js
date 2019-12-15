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

	if (charList.length) {
		switch (args[0]) {
			case 'up':
				start = charList[charList.length - 1].substring(0, 9);
				end = endEnv;
				break;
			case 'down':
				start = charList[0].substring(0, 9);
				end = startEnv;
				break;
			case 'range':
				start = charList[0].substring(0, 9);
				end = startEnv;
				break;
			default:
				args.map(v => Number.parseInt(v)).filter(isNaN).forEach(v => gather(v, v));
		}
	}
	gather(Number.parseInt(start), Number.parseInt(end));
});