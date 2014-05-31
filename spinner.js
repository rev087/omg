require('colors');

function Spinner() {
	var chars = '–\\|/', delay = 100, n = 0, timer;

	function spin() {
		if (n >= chars.length) n = 0;
		process.stdout.write('\b' + chars.substr(n++, 1).green.bold);
		timer = setTimeout(spin, delay);
	}

	this.start = function(msg) {
		process.stdout.write(msg + '  ');
		timer = setTimeout(spin, delay);
	};

	this.stop = function() {
		process.stdout.write('\b \n');
		clearTimeout(timer);
	};
}

module.exports = new Spinner();