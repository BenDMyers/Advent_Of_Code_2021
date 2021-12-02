const fs = require('fs');
const lines = fs
	.readFileSync(`${__dirname}/.input`, 'utf-8')
	.split('\n')
	.map(line => {
		const [direction, amountString] = line.split(' ');
		const amount = Number(amountString);
		return [direction, amount];
	});

// let horizontalOffset = 0;
// let verticalOffset = 0;

// for (const step of lines) {
// 	const [direction, amount] = step;
// 	switch (direction) {
// 		case 'forward':
// 			horizontalOffset += amount;
// 			break;
// 		case 'down':
// 			verticalOffset += amount;
// 			break;
// 		case 'up':
// 			verticalOffset -= amount;
// 			break;
// 	}
// }

// console.log(horizontalOffset * verticalOffset);

let horizontalOffset = 0;
let verticalOffset = 0;
let aim = 0;

for (const step of lines) {
	const [direction, amount] = step;
	switch (direction) {
		case 'forward':
			horizontalOffset += amount;
			verticalOffset += (aim * amount);
			break;
		case 'down':
			aim += amount;
			break;
		case 'up':
			aim -= amount;
			break;
	}
}

console.log(horizontalOffset * verticalOffset);