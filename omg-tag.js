var Parse = require('parse').Parse,
		comm = require('commander'),
		inquirer = require('inquirer'),
		exec = require('child_process').exec,
		spawn = require('child_process').spawn,

		auth = require('./auth'),
		models = require('./models'),
		spinner = require('./spinner');

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
		query.find().then(function(tags) {
			spinner.stop();
			for (var i = 0; i < tags.length; i++) {
				console.log(tags[i].get('name').green);
			};
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
			console.log(
				'\n' +
				bookmarks.length + ' bookmarks matching ' +
				comm.args.join(', ').yellow + ':'.white +
				'\n'
			);
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
				var url = bookmarks[input.num-1].get('url');
				spawn('open', [url]);
			});
		}, function(error) {
			spinner.stop();
			console.error(error.message.red);
		});
	}

});