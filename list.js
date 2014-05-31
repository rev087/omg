var inquirer = require('inquirer');
require('colors');

function validNum(length, input) {
	return input > 0 && input <= length;
}

module.exports = function(bookmarks, keyword) {
	console.log(
		bookmarks.length + ' bookmarks matching ' +
		keyword.yellow +
		(bookmarks.length > 0 ? ':\n'.white : '\n')
	);

	if (bookmarks.length === 0) return;

	for (var i = 0; i < bookmarks.length; i++) {
		var b = bookmarks[i];
		console.log(
			((i+1)+'  ').white +
			b.get('title').blue.bold + '  ' +
			b.get('url').green + '\n   ' +
			('#' + b.get('tags').join(', #')).grey +
			'\n'
		);
	};

	var inqNum = {
		name:'num',
		message:'Open bookmark number:',
		validate: validNum.bind(null, bookmarks.length)
	};

	inquirer.prompt([inqNum], function(input) {
		var bm = bookmarks[input.num-1];
		console.log(('Opening ' + bm.get('title') + '...').grey);
		open(bm.get('url'));
	});
}