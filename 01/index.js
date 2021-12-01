const fs = require('fs');
const lines = fs
	.readFileSync(`${__dirname}/.input`, 'utf-8')
	.split('\n')
	.map(num => Number.parseInt(num));

// Part 1
let numIncreases = 0;

for (let i = 1; i < lines.length; i++) {
	if (lines[i] > lines[i - 1]) {
		numIncreases++;
	}
}

console.log(numIncreases);

// Part 2
let numSlidingWindowIncreases = 0;
let previousWindow = Number.MAX_SAFE_INTEGER;
for (let i = 2; i < lines.length; i++) {
	let window = lines[i - 2] + lines[i - 1] + lines[i];
	if (window > previousWindow) {
		numSlidingWindowIncreases++;
	}

	previousWindow = window;
}

console.log(numSlidingWindowIncreases);