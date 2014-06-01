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

function selectTags(bookmark) {
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

	var knownTags = [];

	var query = new Parse.Query(models.Tag);
	query.find().then(function(objects) {
		for (var i = 0; i < objects.length; i++) {
			knownTags.push(objects[i].get('name'));
		};
	}, function(err) {
		console.error(err.message.red);
		process.exit(1);
	});

	function completeTags(line) {


		var hits = knownTags.filter(function(knownTag) {
			return knownTag.indexOf(line) === 0;
		});

		return [hits, line];
	}

	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		completer: completeTags
	});

	var tags = bookmark.get('tags') || [];
	console.log('Add tags, one per line, empty to finish, Tab to autocomplete, "-" to remove last');

	printTags(tags);

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

module.exports = {prompt: promptForTags, selectTags: selectTags};