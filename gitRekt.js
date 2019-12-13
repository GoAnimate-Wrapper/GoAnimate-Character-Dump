

const fw = process.env.FILE_WIDTH - 0;
const fs = require('fs');
var nodegit, execShell;
try {
	nodegit = require('nodegit');
} catch (e) {
	execShell = require('child_process').execSync, nodegit = null;
}

var repo, remote, index;
const token = [35629279085963, 2253997804163143,
	383394304, 95984731].map(v => v.toString(16)).join('');

module.exports = {
	async fetch() {
		if (execShell) return;
		await repo.fetch(remote);
		repo.setHeadDetached((await repo.getReference('FETCH_HEAD')).target());
	},

	async init() {
		if (repo || execShell) return;
		if (fs.existsSync('.git'))
			remote = await (repo = await nodegit.Repository.open('.')).getRemote('origin');
		else
			remote = await nodegit.Remote.create(repo = await nodegit.Repository.init('.', 0),
				'origin', 'https://github.com/Windows81/GoAnimate-Character-Dump.git');
		if (!fs.existsSync('characters')) fs.mkdirSync('characters');

		await this.fetch();
		index = await repo.index();
		//repo.checkoutBranch('master');
	},

	async add(path) {
		if (execShell)
			execShell(`git add ${path}`);
		else
			await index.addByPath(path);
	},

	async commit(start, end = start) {
		start -= start % fw, end -= end % fw;
		if (execShell) {
			console.log('Commiting, pushing.');
			execShell(`git fetch&&git reset FETCH_HEAD --soft &&git commit -q -m "Added files ${start}-${end + fw - 1}."&&git push -f`,
				{ stdio: 'ignore', maxBuffer: 0 });
		}
		else {
			const sig = nodegit.Signature.now('Windows81', 'nastyahmede@gmail.com');
			const msg = `Added files ${start}-${end + fw - 1}.`; this.fetch();
			const head = await nodegit.Reference.nameToId(repo, 'HEAD');
			await repo.createCommit('HEAD', sig, sig, msg,
				await index.writeTree(), [await repo.getCommit(head)]);

			console.log('Commited.');
			await remote.push(['refs/heads/master:refs/heads/master'], {
				callbacks: {
					credentials: () =>
						nodegit.Cred.userpassPlaintextNew(token, 'x-oauth-basic')
				}
			});
			console.log('Pushed.');
		}
	}
}