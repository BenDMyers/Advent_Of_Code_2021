const fs = require('fs');
const lines = fs
	.readFileSync(`${__dirname}/.input`, 'utf-8')
	.split('\n')
	.map(line => {
		const [direction, amountString] = line.split(' ');
		const amount = Number(amountString);
		return [direction, amount];
	});

// Part 1
(function() {
	let horizontalPosition = 0;
	let depth = 0;
	
	for (const step of lines) {
		const [direction, amount] = step;
		switch (direction) {
			case 'forward':
				horizontalPosition += amount;
				break;
			case 'down':
				depth += amount;
				break;
			case 'up':
				depth -= amount;
				break;
		}
	}
	
	console.log(horizontalPosition * depth);
})();

// Part 2
(function () {
	let horizontalPosition = 0;
	let depth = 0;
	let aim = 0;
	
	for (const step of lines) {
		const [direction, amount] = step;
		switch (direction) {
			case 'forward':
				horizontalPosition += amount;
				depth += (aim * amount);
				break;
			case 'down':
				aim += amount;
				break;
			case 'up':
				aim -= amount;
				break;
		}
	}
	
	console.log(horizontalPosition * depth);
})();