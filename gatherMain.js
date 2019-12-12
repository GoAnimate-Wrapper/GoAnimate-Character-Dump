require('dotenv').config();
const fs = require('fs');
const gather = require('./gather');
const rekt = require('./gitRekt');

const args = process.argv.slice(2);
const gt1 = process.env.GATHER_THRESH1;
const gt2 = process.env.GATHER_THRESH2;


console.log('Starting script.');
rekt.init().then(() => {
	var charList = fs.readdirSync('characters');
	if (charList.length)
		if (args[0]) gather(Number.parseInt(args[1] || charList[0].substring(0, 9)), Number.parseInt(args[2] || gt1));
		else gather(Number.parseInt(args[1] || charList[charList.length - 1].substring(0, 9)), Number.parseInt(args[2] || gt2));
	else gather(gt2, gt3);
});