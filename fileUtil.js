module.exports = {
	makePath: function (startId) {
		return path.join('characters', padZero(startId, process.env.LEADING_DIGITS) + '.txt');
	},
	padZero(n, l) {
		return ('' + n).padStart(l, '0');
	},
}