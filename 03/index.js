// Parse puzzle input
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ?
	`${__dirname}/.test` :
	`${__dirname}/.input`;
const fs = require('fs');
const lines = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n');

/**
 * Gets the most common bit at a given position for a list of bitstrings.
 * Defaults to `1` in the case of a tie.
 * @param {string[]} bitstrings - list of bitstrings
 * @param {number} index - current position within the index
 * @returns {'0' | '1'} - most common bit at that position
 */
function getMostCommonBit(bitstrings, index) {
	let zeroes = 0;
	let ones = 0;

	for (const bitstring of bitstrings) {
		if (bitstring.charAt(index) === '0') {
			zeroes++;
		} else {
			ones++;
		}
	}

	if (ones >= zeroes) {
		return '1';
	} else {
		return '0';
	}
}

// Part 1
let gammaBitstring = '';
let epsilonBitstring = '';

for (let i = 0; i < lines[0].length; i++) {
	console.log(getMostCommonBit(lines, i));
	if (getMostCommonBit(lines, i) === '0') {
		gammaBitstring += '0';
		epsilonBitstring += '1';
	} else {
		gammaBitstring += '1';
		epsilonBitstring += '0';
	}
}

let gamma = parseInt(gammaBitstring, 2);
let epsilon = parseInt(epsilonBitstring, 2);
console.log('Part 1', gamma * epsilon);