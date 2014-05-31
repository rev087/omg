var Parse = require('parse').Parse,
		usr = require('user-settings').file('.omgconfig'),
		inquirer = require('inquirer'),
		validator = require('validator'),
		models = require(__dirname + '/models'),
		spinner = require(__dirname + '/spinner');
require('colors');

function noop() {}

function logOut(fn) {
	if (fn && typeof fn !== 'function') throw new Error('argument must be a function');
	usr.unset('sessionToken');
	console.log('ACCESS TERMINATED'.green);
	process.exit(0);
	fn();
}

function logIn(fn) {
	if (fn && typeof fn !== 'function') throw new Error('argument must be a function');
	var inqUser = {name:'username', message:'username: '};
	var inqPass = {name:'password', message:'password: ', type:'password'};
	inquirer.prompt([inqUser, inqPass], function(input) {
		Parse.User.logIn(input.username, input.password, {
			success: function(user) {
				console.log('ACCESS GRANTED'.green);
				usr.set('sessionToken', user.getSessionToken());
				fn(user);
			},
			error: function(user, error) {
				if (error.code === 101) {
					console.error('ACCESS DENIED'.red.bold);
					process.exit(1);
				} else {
					console.error((error.message).red);
					process.exit(1);
				}
			}
		});
	});
}

function signUp(fn) {
	if (fn && typeof fn !== 'function') throw new Error('argument must be a function');
	var inqUser = {name:'username', message:'username: '};
	var inqPass = {name:'password', message:'password: ', type:'password'};
	var inqEmail = {name:'email', message:'email: ', validate:validator.isEmail};
	inquirer.prompt([inqUser, inqPass, inqEmail], function(input) {
		var user = new Parse.User();
		user.set('username', input.username);
		user.set('password', input.password);
		user.set('email', input.email);
		user.signUp(null, {
			success: function(user) {
				console.log('ACCESS GRANTED'.green);
				usr.set('sessionToken', user.getSessionToken());
				fn(user);
			},
			error: function(user, error) {
				console.error((error.message).red);
				process.exit(1);
			}
		});
	});
}

function session(fn) {
	if (fn && typeof fn !== 'function') throw new Error('argument must be a function');
	var sessionToken = usr.get('sessionToken');

	if(sessionToken) {
		spinner.start('Authenticating'.grey);
		Parse.User.become(sessionToken, {
			success: function(user) {
				spinner.stop();
				fn(user);
			},
			error: function(user, error) {
				spinner.stop();
				usr.unset('sessionToken');
				console.error('ACCESS EXPIRED'.red);
				process.exit(1);
			}
		})
	} else {
		var inqAuth = {
			name:'auth',
			message:'Authorization',
			type:'list',
			choices: [ 'Log In', 'Register', 'Leave' ]
		};
		inquirer.prompt([inqAuth], function(input) {
			if (input.auth === 'Log In') logIn(fn);
			else if (input.auth === 'Register') signUp(fn);
			else process.exit(0);
		});
	}
}

module.exports = {
	session: function(fn) { session(fn); },
	signUp: function() { signUp(noop); },
	logIn: function() { logIn(noop); },
	logOut:  function() { logOut(noop); }
};