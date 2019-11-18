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
	return path.join('characters', padZero(startId, 9) + '.xml');
}

function writeFile(startId, groups, groupLen) {
	return new Promise(res => {
		var a = [], count = 0;
		for (var c = 0; c < groups; c++) {
			const C = c;
			getText(startId, groupLen, groupLen * c).then(t => {
				if (a[C] = t, ++count == groups)
					res(fs.writeFileSync(makePath(startId), a.join('')));
			});
		}
	});
}

async function run(top) {
	for (var c = top; c >= 0; c -= 1000)
		await writeFile(c, 100, 10);
}

run(328493000);