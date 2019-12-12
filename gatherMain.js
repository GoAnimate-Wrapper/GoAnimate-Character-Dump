require('dotenv').config();
const fs = require('fs');
const gather = require('./gather');
console.log('Starting script.');

const args = process.argv.slice(2);
const gt1 = args[1] || process.env.GATHER_THRESH1;
const gt2 = args[2] || process.env.GATHER_THRESH2;
const gt3 = args[3] || process.env.GATHER_THRESH3;

var charList = fs.readdirSync('characters');
if (charList.length) {
	if (args[0]) {
		var minFile = Number.parseInt(charList[0].substring(0, 9));
		gather(minFile, gt1).then(() => gather(gt2, gt3).then(() => gather(gt1, 0)));
	}
	else {
		var maxFile = Number.parseInt(charList[charList.length-1].substring(0, 9));
		gather(maxFile, gt3);
	}
}
else gather(gt2, gt3);
