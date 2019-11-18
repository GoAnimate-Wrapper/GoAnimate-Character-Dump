const fs = require('fs');
const path = require('path');
const request = require('request');
const xml = require('xml2js');

function get(c) {
	return new Promise((res, rej) =>
		request.post('https://ga.vyond.com/goapi/getCcCharCompositionXml/', { formData: { assetId: c } },
			(e, r, b) => b[0] == '0' ? res(b.split('\n')[1]) : rej(b.substring(1))));
}

function padZero(n, l) {
	return ('' + n).padStart(l, '0');
};

async function getText(startId, len, offset = 0, numWidth = 3) {
	for (var c = offset, C = startId + offset, text = ''; c < len + offset; ++c, C++) {
		try {
			text += padZero(c, numWidth) + await get(C) + '\n';
			//console.log(C);
		} catch (x) { }
	}
	return text;
}

function makePath(startId) {
	return path.join('characters', padZero(startId, 9) + '.txt');
}

function writeFile(startId, groups, groupLen) {
	return new Promise(res => {
		var a = [], count = 0;
		for (var c = 0; c < groups; c++) {
			const C = c;
			getText(startId, groupLen, groupLen * c).then(t => {
				if (a[C] = t, ++count == groups) {
					console.log(startId);
					res(fs.writeFileSync(makePath(startId), a.join('')));
				}
			});
		}
	});
}

async function run(start = 0, end = 0, groups = 100, groupLen = 10) {
	var len = end - start;
	var sign = Math.sign(len);
	var delta = groups * groupLen;
	switch (sign) {
		case 0:
			throw "Arguments 'start' and 'end' can't match.";
		case 1:
			for (var c = start; c <= end; c += delta)
				await writeFile(c, groups, groupLen);
			break;
		case -1:
			for (var c = start; c >= end; c -= delta)
				await writeFile(c, groups, groupLen);
			break;
	}
}

run(Number.parseInt(fs.readdirSync('characters')[0].substring(0, 9)) - 1000);