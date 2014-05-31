var Parse = require('parse').Parse,
		comm = require('commander'),
		inquirer = require('inquirer'),
		open = require('open'),

		auth = require('./auth'),
		models = require('./models'),
		spinner = require('./spinner'),
		list = require('./list');

require('colors');

comm.parse(process.argv);

function validNum(length, input) {
	return input > 0 && input <= length;
}

auth.session(function(user) {

	// List tags with user omits <tag>
	if (!comm.args.length) {
		spinner.start('Fetching tags'.grey);
		var query = new Parse.Query(models.Tag);
		query.ascending('name');
		query.find().then(function(tags) {
			spinner.stop();
			console.log(tags.length + ' tags found');
			for (var i = 0; i < tags.length; i++) {
				if (i > 0) process.stdout.write(', '.grey);
				process.stdout.write(tags[i].get('name').green);
			};
			console.log('');
		}, function(error) {
			spinner.stop();
			console.error(error.message.red);
		});
	}

	// List Bookmarks with <tag>
	else {
		spinner.start('Fetching bookmarks'.grey);
		var query = new Parse.Query(models.Bookmark);
		query.containsAll('tags', comm.args);
		query.ascending('title');
		query.find().then(function(bookmarks) {
			spinner.stop();
			list(bookmarks, comm.args.join(', '));
		}, function(error) {
			spinner.stop();
			console.error(error.message.red);
		});
	}

});