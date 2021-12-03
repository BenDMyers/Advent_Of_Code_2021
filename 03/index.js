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
console.log('Part 1', {
	gamma,
	epsilon,
	product: gamma * epsilon
});

// Part 2
let oxygenGeneratorCandidates = [...lines];
let oxygenGeneratorBitIndex = 0;

while (oxygenGeneratorCandidates.length > 1) {
	let mostCommonBit = getMostCommonBit(oxygenGeneratorCandidates, oxygenGeneratorBitIndex);
	oxygenGeneratorCandidates = oxygenGeneratorCandidates.filter((candidate) => (
		candidate.charAt(oxygenGeneratorBitIndex) === mostCommonBit
	));

	oxygenGeneratorBitIndex++;
}

const [oxygenGeneratorRatingBitstring] = oxygenGeneratorCandidates;
const oxygenGeneratorRating = parseInt(oxygenGeneratorRatingBitstring, 2);

let co2ScrubberCandidates = [...lines];
let co2ScrubberBitIndex = 0;

while (co2ScrubberCandidates.length > 1) {
	let leastCommonBit = (getMostCommonBit(co2ScrubberCandidates, co2ScrubberBitIndex) === '0') ? '1' : '0';
	co2ScrubberCandidates = co2ScrubberCandidates.filter((candidate) => (
		candidate.charAt(co2ScrubberBitIndex) === leastCommonBit
	));

	co2ScrubberBitIndex++;
}

const [co2ScrubberRatingBitstring] = co2ScrubberCandidates;
const co2ScrubberRating = parseInt(co2ScrubberRatingBitstring, 2);

console.log('Part 2', {
	oxygenGeneratorRating,
	co2ScrubberRating,
	product: oxygenGeneratorRating * co2ScrubberRating
});