var Parse = require('parse').Parse,
		comm = require('commander'),

		auth = require('./auth'),
		models = require('./models'),
		spinner = require('./spinner'),
		list = require('./list');

require('colors');

comm.parse(process.argv);

auth.session(function(user) {

	spinner.start('Searching bookmarks'.grey);
	var query = new Parse.Query(models.Bookmark);
	query.contains('title', comm.args.join(' '));
	query.ascending('title');
	query.find().then(function(bookmarks) {
		spinner.stop();
		list(bookmarks, comm.args.join(', '));
	}, function(error) {
		spinner.stop();
		console.error(error.message.red);
	});
});