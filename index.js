require('dotenv').config();
const fs = require('fs');
const gather = require('./gather');
const server = require('./server');

// Local wrapper for the gathering sequence.
var charList = fs.readdirSync('characters');
if (charList.length) {
	var minFile = Number.parseInt(charList[0].substring(0, 9));
	gather(minFile, process.env.GATHER_THRESH2).then(() => {
		return gather(process.env.GATHER_THRESH2, process.env.GATHER_THRESH3);
	});
}
else gather(process.env.GATHER_THRESH2, process.env.GATHER_THRESH3);

// Wrapper for server functionality.
server();