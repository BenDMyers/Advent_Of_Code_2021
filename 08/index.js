const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;

/**
 * In a fully functioning display, the digit (key) would have all the segments listed in the value
 */
const CANONICAL_SEGMENTS = {
	'0': ['a', 'b', 'c', 'e', 'f', 'g'], 		// 6 segments
	'1': ['c', 'f'],							// 2 segments
	'2': ['a', 'c', 'd', 'e', 'g'],				// 5 segments
	'3': ['a', 'c', 'd', 'f', 'g'],				// 5 segments
	'4': ['b', 'c', 'd', 'f'],					// 4 segments
	'5': ['a', 'b', 'd', 'f', 'g'],				// 5 segments
	'6': ['a', 'b', 'd', 'e', 'f', 'g'],		// 6 segments
	'7': ['a', 'c', 'f'],						// 3 segments
	'8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],	// 7 segments
	'9': ['a', 'b', 'c', 'd', 'f']				// 5 segments
}

/** @type {{allDigits: string[], inputDigits: string[]}[]} */
const lines = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n')
	.map(line => {
		const [allDigits, inputDigits] = line
			.split(' | ')
			.map((digitList) => {
				return digitList
					.trim()
					.split(' ')
					.map(digits => digits.split('').sort().join(''))
			});
		return {allDigits, inputDigits};
	});

// Part 1
(function () {
	let numOnes = 0;
	let numFours = 0;
	let numSevens = 0;
	let numEights = 0;
	
	for (let line of lines) {
		for (let inputDigit of line.inputDigits) {
			if (inputDigit.length === CANONICAL_SEGMENTS['1'].length)
				numOnes++;
			if (inputDigit.length === CANONICAL_SEGMENTS['4'].length)
				numFours++;
			if (inputDigit.length === CANONICAL_SEGMENTS['7'].length)
				numSevens++;
			if (inputDigit.length === CANONICAL_SEGMENTS['8'].length)
				numEights++;
		}
	}
	
	console.log(numOnes + numFours + numSevens + numEights);
})();