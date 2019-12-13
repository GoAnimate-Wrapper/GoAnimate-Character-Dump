require('dotenv').config();
const fs = require('fs');
const gather = require('./gather');
const rekt = require('./gitRekt');

const args = process.argv.slice(2).reverse();
const gt1 = process.env.GATHER_THRESH1;
const gt2 = process.env.GATHER_THRESH2;

console.log('Starting script.');
rekt.init().then(() => {
	var charList = fs.readdirSync('characters').sort();
	var start = args[1] || gt1, end = args[0] || gt2;

	if (charList.length) {
		switch (args[args.length - 1]) {
			case 'up':
				start = charList[0].substring(0, 9);
				end = gt1;
				break;
			case 'down':
				start = charList[charList.length - 1].substring(0, 9);
				end = gt2;
				break;
		}
	}
	gather(Number.parseInt(start), Number.parseInt(end));
});