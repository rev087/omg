var Parse = require('parse').Parse,
		models = require('./models'),
		readline = require('readline'),
		colors = require('colors');

function printTags(tags) {
	var str = '\bTags'.blue.bold + ': '.grey;
	for (var i = 0; i < tags.length; i++) {
		if (i > 0) str += ', '.grey;
		str += tags[i].green;
	};
	console.log(str);
}

function setBookmarkTags(bookmark) {
	var promise = new Parse.Promise();
	promptForTags(bookmark, function(tags) {
		bookmark.set('tags', tags);
		bookmark.save().then(function() {
			promise.resolve(bookmark);
		});
	});
	return promise;
}

function promptForTags(bookmark, fn) {	

	function completeTags(line) {
		var tags = ['node', 'angular', 'express', 'rethinkdb', 'redis', 'elasticsearch'];

		var hits = tags.filter(function(tag) {
			return tag.indexOf(line) === 0;
		});

		return [hits, line];
	}

	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		completer: completeTags
	});

	var tags = [];
	console.log('Add tags, one per line, empty to finish, Tab to autocomplete, "-" to remove last');
	rl.setPrompt('#'.green, 1);
	rl.prompt();

	rl.on('line', function(tag) {
		if (tag === '-') {
			tags.pop();
			printTags(tags);
			rl.prompt();
		} else if (tag.length) {
			if (tags.indexOf(tag) < 0) {
				tags.push(tag);
			}
			printTags(tags);
			rl.prompt();
		} else {
			rl.write('');
			rl.close();
			fn(tags);
		}
	});
}

module.exports = {prompt: promptForTags, setTags: setBookmarkTags};