var Parse = require('parse').Parse,
		comm = require('commander'),

		auth = require('./auth'),
		models = require('./models');

require('colors');

comm.parse(process.argv);

auth.session(function(user) {
	console.log(user.get('username').cyan);
	
	var query = new Parse.Query(models.Tag);
	query.find().then(function(tags) {
		for (var i = 0; i < tags.length; i++) {
			console.log(tags[i].get('name').green);
		};
	}, function(error) {
		console.error(error);
	})

});