const fs = require('fs');
const lines = fs
	.readFileSync(`${__dirname}/.input`, 'utf-8')
	.split('\n')
	.map(num => Number.parseInt(num));

let numIncreases = 0;

for (let i = 1; i < lines.length; i++) {
	if (lines[i] > lines[i - 1]) {
		numIncreases++;
	}
}

console.log(numIncreases);