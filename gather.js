const threads = process.env.GATHER_THREADS;
const xNumWidth = process.env.XML_NUM_WIDTH;
const fw = process.env.FILE_WIDTH;

const fs = require('fs');
const request = require('request');
const fUtil = require('./fileUtil');

const threadPerCycle = fw / threads;
if (fw % threads)
	throw 'FILE_WIDTH / GATHER_THREADS should be equal to an integer.';

function getData(c) {
	return new Promise((res, rej) =>
		request.post('https://ga.vyond.com/goapi/getCcCharCompositionXml/', { formData: { assetId: c } },
			(e, r, b) => !b ? getData(c).then(res).catch(rej) : b[0] == '0' ? res(b.split('\n')[1]) : rej(b.substring(1))));
}

async function getGranule(startId, len, offset = 0) {
	for (var c = offset, C = startId + offset, text = ''; c < len + offset; ++c, C++) {
		try {
			text += fUtil.padZero(c, xNumWidth) + await getData(C) + '\n';
			console.log(C);
		} catch (x) { }
	}
	return text;
}

function processFile(startId, groups, groupLen) {
	return new Promise(res => {

		var a = [], count = 0;
		const path = fUtil.makePath(startId);
		if (fs.existsSync(path)) res();

		for (let c = 0; c < groups; c++)
			getGranule(startId, groupLen, groupLen * c).then(t => {
				if (a[c] = t, ++count == groups) {
					console.log('Writing to file.');
					res(fs.writeFileSync(path, a.join('')));
				}
			});
	});
}

async function gather(start = 0, end = 0) {

	if (start < 0 || end < 0) return;
	start -= start % fw, end -= end % fw;
	const len = end - start, sign = Math.sign(len);
	var delta = threads * threadPerCycle;
	switch (sign) {
		case 1:
			end -= fw;
			for (var c = start; c <= end; c += delta)
				await processFile(c, threads, threadPerCycle);
			break;
		case -1:
			start -= fw;
			for (var c = start; c >= end; c -= delta)
				await processFile(c, threads, threadPerCycle);
			break;
	}
}

module.exports = gather;