

const fw = process.env.FILE_WIDTH - 0;
const fs = require('fs');
var nodegit, execShell;
try {
	nodegit = require('nodegit');
} catch (e) {
	execShell = require('child_process').execSync, nodegit = null;
}

const token = [35629279085963, 2253997804163143,
	383394304, 95984731].map(v => v.toString(16)).join('');

/** @type {nodegit.Repository} */ var repo;
/** @type { nodegit.Remote } */ var remote;
/** @type { nodegit.Index } */ var index;

module.exports = {
	async init() {
		if (repo || execShell) return;
		if (fs.existsSync('.git'))
			remote = await (repo = await nodegit.Repository.open('.')).getRemote('origin');
		else
			remote = await nodegit.Remote.create(repo = await nodegit.Repository.init('.', 0),
				'origin', 'https://github.com/Windows81/GoAnimate-Character-Dump.git');
		index = await repo.index();
		await repo.fetch(remote);

		repo.setHeadDetached((await repo.getReference('FETCH_HEAD')).target());
		if (!fs.existsSync('characters')) fs.mkdirSync('characters');
		//repo.checkoutBranch('master');
	},

	async add(path) {
		if (execShell)
			execShell(`git add ${path}`);
		else
			await index.addByPath(path);
	},

	async commit(start, end = start) {
		if (execShell)
			execShell(`git commit -q -m "Added files ${start}-${end + fw - 1}."&&git push -q`,
				{ stdio: 'ignore', maxBuffer: 0 });
		else {
			const sig = nodegit.Signature.now('Windows81', 'nastyahmede@gmail.com');
			await repo.createCommit('HEAD', sig, sig, `Added files ${start}-${end + fw - 1}.`);
			await remote.push(['refs/heads/master:refs/heads/master'], {
				callbacks: {
					credentials: () =>
						nodegit.Cred.userpassPlaintextNew(token, 'x-oauth-basic')
				}
			});
		}
		console.log('Commiting, pushing.');
	}
}