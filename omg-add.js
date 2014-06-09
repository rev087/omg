#!/usr/bin/env node
var Parse = require('parse').Parse,
		comm = require('commander'),
		request = require('request'),
		inquirer = require('inquirer'),
		validator = require('validator'),
		cheerio = require('cheerio');

var models = require(__dirname + '/models'),
		auth = require(__dirname + '/auth'),
		spinner = require(__dirname + '/spinner'),
		tagger = require(__dirname + '/tagger');

comm.parse(process.argv);

function fetchBookmark(user, addr, title) {
	var query = new Parse.Query(models.Bookmark);
	query.equalTo("url", addr);
	query.first().then(function(object) {
		var bookmark;
		if (object) {
			console.log('URL already stored'.grey);
			bookmark = object;
		} else {
			bookmark = new models.Bookmark();
			bookmark.setACL(new Parse.ACL(user));
			bookmark.set('url', addr);
		}
		bookmark.set('title', title);
	  return tagger.selectTags(bookmark);
	}).then(function(bookmark) {
		console.log('OK'.green.bold);
		process.exit(0);
	});
}

function promptTitle(user, addr) {
	var inqTitle = {name:'title', message:'Title:'};
	inquirer.prompt([inqTitle], function(input) {
		fetchBookmark(user, addr, input.title);
	});
}

function add(user, addr) {
	if (!validator.isURL(addr)) {
		console.error(('Silly human, "'+addr+'" is not really a real URL').red);
		process.exit(1);
	}

	spinner.start(('Fetching "'+addr+'"').grey);
	request(addr, function (error, response, body) {
		spinner.stop();
	  if (!error && response.statusCode === 200) {
	  	var $ = cheerio.load(body),
	  			title = $('title').text(),
	  			meta = $('meta[name][content]');
	  	

	  	console.log(
	  		'URL'.blue.bold + ': '.grey +
	  		addr.green +
	  		'\nTitle'.blue.bold + ': '.grey +
	  		title.green
  		);

  		for (var m = 0; m < meta.length; m++) {
  			console.log(
  				'Meta'.blue.bold + '-'.grey +
	  			meta.eq(m).attr('name').blue.bold + ': '.grey +
	  			meta.eq(m).attr('content').green
				);
  		};

  		fetchBookmark(user, addr, title);

	  } else if (!error && response.statusCode !== 200) {
	  	console.error(('"'+addr+'" returned HTTP status '+response.statusCode).red);
	  	promptTitle(user, addr);
	  } else if (error.code === 'ENOTFOUND') {
	  	console.error(('Silly human, "'+addr+'" does not exist').red);
	  	process.exit(1);
	  } else {
	  	console.error(error.message.red);
	  }
	});
}

auth.session(function(user) {
	for (var i = 0; i < comm.args.length; i++) {
		add(user, comm.args[i]);
	};
});