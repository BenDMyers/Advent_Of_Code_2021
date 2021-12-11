const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;

/*
	2 segments:
		- 1
	3 segments:
		- 7
	4 segments:
		- 4
	5 segments:
		- 2
		- 3
		- 5
	6 segments:
		- 0
		- 6
		- 9
	7 segments:
		- 8
 */

/**
 * In a fully functioning display, the digit (key) would have all the segments listed in the value
 */
const SEGMENTS = {
	'0': 'abcefg', 		// 6 segments
	'1': 'cf',			// 2 segments
	'2': 'acdeg',		// 5 segments
	'3': 'acdfg',		// 5 segments
	'4': 'bcdf',		// 4 segments
	'5': 'abdfg',		// 5 segments
	'6': 'abdefg',		// 6 segments
	'7': 'acf',			// 3 segments
	'8': 'abcdefg',		// 7 segments
	'9': 'abcdfg'		// 6 segments
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
			if (inputDigit.length === SEGMENTS['1'].length)
				numOnes++;
			if (inputDigit.length === SEGMENTS['4'].length)
				numFours++;
			if (inputDigit.length === SEGMENTS['7'].length)
				numSevens++;
			if (inputDigit.length === SEGMENTS['8'].length)
				numEights++;
		}
	}
	
	console.log(numOnes + numFours + numSevens + numEights);
})();

// Part 2
(function() {
	/**
	 * 
	 * @param {string} shorter the shorter of two strings
	 * @param {string} longer the longer of two strings
	 * @returns {string} characters that are in the longer string, but not the shorter string
	 */
	function getAddedCharacters(shorter, longer) {
		return longer
			.split('')
			.filter(x => !shorter.includes(x))
			.join('');
	}

	/**
	 * Solves a line and returns it four-digit solution
	 * @param {{allDigits: string[], inputDigits: string[]}} line
	 * @returns {string} correct solution for four-digit display
	 */
	function solveLine(line) {
		const {allDigits, inputDigits} = line;

		const displays = {};

		displays[1] = allDigits.find(display => (display.length === SEGMENTS['1'].length));
		displays[4] = allDigits.find(display => (display.length === SEGMENTS['4'].length));
		displays[7] = allDigits.find(display => (display.length === SEGMENTS['7'].length));
		displays[8] = allDigits.find(display => (display.length === SEGMENTS['8'].length));

		// 0 and 9 both have "c" and "f" (the segments that make up 1)
		// but 6 does not have "c"
		// Known wires: 14678
		displays[6] = allDigits.find(digit => {
			const cf = displays[1];
			const hasSixSegments = digit.length === 6;
			const containsCF = digit.includes(cf[0]) && digit.includes(cf[1]);
			return hasSixSegments && !containsCF;
		});

		// The only segment 6 is missing is "c"
		const c = getAddedCharacters(displays[6], displays[8]);

		// 5 is the only five-digit display missing a "c"
		// Known wires: 145678
		displays[5] = allDigits.find(digit => {
			const hasFiveSegments = digit.length === 5;
			const containsC = digit.includes(c);
			return hasFiveSegments && !containsC;
		});

		// 6 = 5 + "e"
		const e = getAddedCharacters(displays[5], displays[6]);

		// The only segment 9 is missing is "e"
		// Known wires: 1456789
		displays[9] = allDigits.find(digit => {
			const hasSixSegments = digit.length === 6;
			const containsE = digit.includes(e);
			return hasSixSegments && !containsE;
		});

		// 0 is the last unsolved six-segment display
		// Known wires: 01456789
		displays[0] = allDigits.find(digit => {
			const hasSixSegments = digit.length === 6;
			const isSolved = Object.values(displays).includes(digit);
			return hasSixSegments && !isSolved;
		});

		// 2 has "e," but 3 does not
		// Known wires: 012456789
		displays[2] = allDigits.find(digit => {
			const hasFiveSegments = digit.length === 5;
			const containsE = digit.includes(e);
			const isSolved = Object.values(displays).includes(digit);
			return hasFiveSegments && containsE && !isSolved;
		});
		
		// Known wires: 0123456789
		displays[3] = allDigits.find(digit => {
			const hasFiveSegments = digit.length === 5;
			const isSolved = Object.values(displays).includes(digit);
			return hasFiveSegments && !isSolved;
		});

		// Reshape results so given a set of wires, we can get the appropriate digit
		let wiresToDigit = {};
		for (const digit in displays) {
			const wires = displays[digit];
			wiresToDigit[wires] = digit;
		}

		return inputDigits
			.map(wires => wiresToDigit[wires])
			.join('');
	}

	let sum = 0;
	for (line of lines) {
		const fourDigitSequence = solveLine(line);
		console.log(fourDigitSequence)
		sum += Number(fourDigitSequence);
	}
	console.log(sum);
})();