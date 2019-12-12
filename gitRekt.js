const fw = process.env.FILE_WIDTH - 0;
const nodegit = require('nodegit');
const fs = require('fs');
var repo, remote, index;

module.exports = {
	async init() {
		if (repo) return;
		if (fs.existsSync('.git'))
			remote = await (repo = await nodegit.Repository.open('.')).getRemote('origin');
		else
			remote = await nodegit.Remote.create(repo = await nodegit.Repository.init('.', 0),
				'origin', 'https://github.com/Windows81/GoAnimate-Character-Dump.git');
		index = await repo.index();
		await repo.fetch(remote);

		const sign = nodegit.Signature.create('Windows81', 'nastyahmede@gmail.com', 666, 666);
		repo.setHeadDetached((await repo.getReference('FETCH_HEAD')).target());
		if (!fs.existsSync('characters')) fs.mkdirSync('characters');
	},

	async add(path) {
		index.addByPath(path);
	},

	async commit(start, end = start) {
		repo.createCommit('HEAD', sign, sign, `Added files ${start}-${end + fw - 1}.`);

		/*
		exec(`git commit -q -m "Added files ${start}-${end + fw - 1}."&&git push -q`,
			{ stdio: 'ignore', maxBuffer: 0 });
		console.log('Commiting, pushing.');
		*/
	}
}