const fs = require('fs');
const lines = fs
	.readFileSync(`${__dirname}/.input`, 'utf-8')
	.split('\n')
	.map(line => line.split(''));

// Part 1
(function () {
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
})();

// Part 2
(function () {
	/**
	 * Determines the most common bit in a given position given a list of bitstrings.
	 * Defaults to `1` in a tie.
	 * @param {string[]} bitstrings - a list of bitstrings
	 * @param {number} index - current position within the bitstring
	 * @returns {'0' | '1'} - most common bit in the given location (defaults to `1` in a tie)
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

		if (zeroes > ones) {
			return '0';
		} else {
			return '1';
		}
	}

	/**
	 * Determines the least common bit in a given position given a list of bitstrings.
	 * Defaults to `0` in a tie.
	 * @param {string[]} bitstrings - a list of bitstrings
	 * @param {number} index - current position within the bitstring
	 * @returns {'0' | '1'} - least common bit in the given location (defaults to `0` in a tie)
	 */
	 function getLeastCommonBit(bitstrings, index) {
		let zeroes = 0;
		let ones = 0;

		for (const bitstring of bitstrings) {
			if (bitstring.charAt(index) === '0') {
				zeroes++;
			} else {
				ones++;
			}
		}

		if (zeroes <= ones) {
			return '0';
		} else {
			return '1';
		}
	}

	// Determine the oxygen generator rating
	let oxygenGeneratorCandidates = lines.map(line => line.join(''));
	let oxygenGeneratorBitIndex = 0;
	while (oxygenGeneratorCandidates.length > 1) {
		let mostCommonBit = getMostCommonBit(oxygenGeneratorCandidates, oxygenGeneratorBitIndex);
		if (mostCommonBit === '01') {
			mostCommonBit = '1';
		}

		oxygenGeneratorCandidates = oxygenGeneratorCandidates.filter(candidate => candidate.charAt(oxygenGeneratorBitIndex) === mostCommonBit);
		oxygenGeneratorBitIndex++;
	}

	const [oxygenGeneratorRatingBitstring] = oxygenGeneratorCandidates;
	const oxygenGeneratorRating = parseInt(oxygenGeneratorRatingBitstring, 2);

	// Determine the CO2 scrubber rating
	let co2ScrubberCandidates = lines.map(line => line.join(''));
	let co2ScrubberBitIndex = 0;
	while (co2ScrubberCandidates.length > 1) {
		let leastCommonBit = getLeastCommonBit(co2ScrubberCandidates, co2ScrubberBitIndex);
		if (leastCommonBit === '01') {
			leastCommonBit = '0';
		}

		co2ScrubberCandidates = co2ScrubberCandidates.filter(candidate => candidate.charAt(co2ScrubberBitIndex) === leastCommonBit);
		co2ScrubberBitIndex++;
	}
	const [co2ScrubberRatingBitstring] = co2ScrubberCandidates;
	const co2ScrubberRating = parseInt(co2ScrubberRatingBitstring, 2);

	// Final product
	console.log(oxygenGeneratorRating * co2ScrubberRating);
})();