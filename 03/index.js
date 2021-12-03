const fs = require('fs');
const lines = fs
	.readFileSync(`${__dirname}/.input`, 'utf-8')
	.split('\n')
	.map(line => line.split(''));


let gammaBits = '';
let epsilonBits = '';

for (let col = 0; col < lines[0].length; col++) {
	let zeroes = 0;
	let ones = 0;
	for (let row = 0; row < lines.length; row++) {
		let bit = lines[row][col];
		if (bit === '0') {
			zeroes++;
		} else {
			ones++;
		}
	}

	if (zeroes > ones) {
		gammaBits += '0';
		epsilonBits += '1';
	} else {
		gammaBits += '1';
		epsilonBits += '0';
	}
}

let gamma = Number.parseInt(gammaBits, 2);
let epsilon = Number.parseInt(epsilonBits, 2);
console.log(gamma * epsilon);