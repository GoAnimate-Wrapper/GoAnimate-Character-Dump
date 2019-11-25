require('dotenv').config();
const fs = require('fs');
const gather = require('./gather');

const gt1 = process.env.GATHER_THRESH1;
const gt2 = process.env.GATHER_THRESH2;
const gt3 = process.env.GATHER_THRESH3;

var charList = fs.readdirSync('characters');
if (charList.length) {
	var minFile = Number.parseInt(charList[0].substring(0, 9));
	gather(minFile, gt1).then(() => gather(gt2, gt3).then(() => gather(gt1, 0)));
}
else gather(gt2, gt3);