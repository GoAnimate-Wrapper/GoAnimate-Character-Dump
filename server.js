const port = process.env.SERVER_PORT;
const fw = process.env.FILE_WIDTH;
const baseUrl = process.env.BASE_URL;
const lds = process.env.LEADING_DIGITS;
const numWidth = process.env.XML_NUM_WIDTH;

const http = require('http');
const url = require('url');
const request = require('request');

function retrieve(id) {
	return new Promise((res, rej) => {
		const startId = '' + (id - id % fw);
		const url = baseUrl.replace(/%s/g, startId.padStart(lds, '0'))
		request.get(url, (e, r, b) => {
			if (e || !b) rej(e);
			b.split('\n')
		});
	});
}

modules.export = function () {
	http.createServer((req, res) => {
		retrieve(req.url.substr(1));
	}).listen(port);
}