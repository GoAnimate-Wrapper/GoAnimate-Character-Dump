const path = require('path');

module.exports = {
	makePath(startId) {
		return path.join('characters', this.padZero(startId) + '.txt');
	},
	padZero(n, l = process.env.FILE_NUM_WIDTH) {
		return ('' + n).padStart(l, '0');
	},
	fillTemplate(temp, info) {
		return temp.replace(/%s/g, info);
	},
}