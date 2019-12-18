const fw = process.env.FILE_WIDTH - 0;
const fs = require('fs');
const execShell = require('child_process').execSync;

var repo, remote, index;
const token = [35629279085963, 2253997804163143,
	383394304, 95984731].map(v => v.toString(16)).join('');

module.exports = {
	async fetch() {
		if (execShell) return;
		await repo.fetch(remote);
		const c = await repo.getReferenceCommit('FETCH_HEAD');
		await nodegit.Reset.reset(repo, c, 1);
	},

	async init() { },

	async add(path) {
		execShell(`git add ${path}`);
	},

	async commit(start, end = start) {
		start -= start % fw, end -= end % fw;
		console.log('Commiting, pushing.');
		execShell(`git fetch&&git reset FETCH_HEAD --soft &&git commit -q -m "Added files ${start}-${end + fw - 1}."&&git push -f`,
			{ stdio: 'ignore', maxBuffer: 0 });
	}
}