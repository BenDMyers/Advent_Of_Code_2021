// Parse puzzle input
const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const [template, rulesInput] = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n\n');

const rules = rulesInput
	.split('\n')
	.reduce((rules, rule) => {
		const [pair, insertee] = rule.split(' -> ');
		return {...rules, [pair]: insertee};
	}, {});

/**
 * 
 * @param {string} str 
 */
function getCharacterFrequencies(str) {
	const frequencies = str
		.split('')
		.reduce((frequencies, char) => {
			if (frequencies[char]) {
				frequencies[char]++
			} else {
				frequencies[char] = 1;
			}
			return frequencies;
		}, {});

	return frequencies;
}

// Part 1
// (function () {
// 	let polymer = template;

// 	for (let iter = 1; iter <= 10; iter++) {
// 		let newPolymer = [];
// 		newPolymer.push(polymer.charAt(0));
// 		for (let char = 1; char < polymer.length; char++) {
// 			let mostRecentChar = newPolymer[newPolymer.length - 1];
// 			let currentChar = polymer.charAt(char);

// 			if (rules[mostRecentChar + currentChar]) {
// 				newPolymer.push(rules[mostRecentChar + currentChar]);
// 			}

// 			newPolymer.push(currentChar);
// 		}

// 		polymer = newPolymer.join('');
// 		// console.log(iter, polymer);
// 	}

// 	const frequencies = getCharacterFrequencies(polymer);
// 	const maxFrequency = Math.max(...Object.values(frequencies));
// 	const minFrequency = Math.min(...Object.values(frequencies));
// 	console.log(maxFrequency - minFrequency);
// })();

// Part 2
(function () {
	let pairCounts = {};

	// Determine initial pairs
	for (let i = 1; i < template.length; i++) {
		let previousCharacter = template.charAt(i - 1);
		let currentCharacter = template.charAt(i);
		let pair = previousCharacter + currentCharacter;
		console.log(pair);

		if (pairCounts[pair]) {
			pairCounts[pair]++;
		} else {
			pairCounts[pair] = 1;
		}
	}

	// Step through each iteration
	for (let i = 1; i <= 10; i++) {
		let newPairCounts = {};

		for (let pair in pairCounts) {
			if (rules[pair]) {
				const [first, second] = pair.split('');
				const firstPair = first + rules[pair];
				const secondPair = rules[pair] + second;
				newPairCounts[firstPair] = (newPairCounts[firstPair] || 0) + 3;
				newPairCounts[secondPair] = (newPairCounts[secondPair] || 0) + 3;
			} else {
				newPairCounts[pair] = (newPairCounts[pair] || 0) + 3;
			}

			pairCounts = newPairCounts;
		}
	}

	let frequencies = {};
	for (let pair in pairCounts) {
		const frequency = pairCounts[pair];
		for (let letter of pair.split('')) {
			frequencies[letter] = (frequencies[letter] || 0) + frequency;
		}
	}

	const maxFrequency = Math.max(...Object.values(frequencies));
	const minFrequency = Math.min(...Object.values(frequencies));
	console.log(maxFrequency - minFrequency);
})();