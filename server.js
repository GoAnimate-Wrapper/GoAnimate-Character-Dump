require('dotenv').config();
const fNumWidth = process.env.FILE_NUM_WIDTH;
const xNumWidth = process.env.XML_NUM_WIDTH;
const crossdomain = process.env.CROSSDOMAIN;
const port = process.env.SERVER_PORT;
const baseUrl = process.env.BASE_URL;
const sXml = process.env.SUCCESS_XML;
const fXml = process.env.FAILURE_XML;
const fw = process.env.FILE_WIDTH;

const http = require('http');
const request = require('request');
const qs = require('querystring');
const fUtil = require('./fileUtil');

function retrieve(id) {
	return new Promise((res, rej) => {
		const xmlSubId = id % fw, fileId = id - xmlSubId;
		const lnNum = fUtil.padZero(xmlSubId, xNumWidth);
		const url = fUtil.fillTemplate(baseUrl, fUtil.makePath(fileId));
		request.get(url, (e, r, b) => {
			if (r.statusCode != 200) rej(fXml);
			var line = b.split('\n').find(v => v.substr(0, xNumWidth) == lnNum);
			line ? res(fUtil.fillTemplate(sXml, line.substr(xNumWidth))) : rej(fXml);
		});
	});
}

function retrieveGoAPI(res, id) {
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	return retrieve(id)
		.then(v => { res.statusCode = 200, res.end(0 + v); })
		.catch(v => { res.statusCode = 404, res.end(1 + v); });
}

function retrieveGet(res, id) {
	res.setHeader('Content-Type', 'text/xml');
	return retrieve(id)
		.then(v => { res.statusCode = 200, res.end(v); })
		.catch(v => { res.statusCode = 404, res.end(v); });
}

http.createServer((req, res) => {
	var f = req.url.substr(1);
	if (req.method == 'POST') {
		var queryData = '';
		req.on('data', data => {
			queryData += data;
			if (queryData.length > 1e6) {
				queryData = '';
				response.writeHead(413, { 'Content-Type': 'text/plain' }).end();
				req.connection.destroy();
			}
		});

		req.on('end', () => retrieveGoAPI(res,
			qs.parse(queryData).original_asset_id));
	}
	else if (f == 'crossdomain.xml') {
		res.setHeader('Content-Type', 'text/html; charset=UTF-8');
		res.end(crossdomain);
	}
	else retrieveGet(res, f - 0);
}).listen(port - 0, console.log);