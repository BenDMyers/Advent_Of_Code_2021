const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const lines = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n')
	.map(line => line.split(''));

const OPENING_BRACKETS = '({[<';
const MATCHES = {
	')': '(',
	']': '[',
	'}': '{',
	'>': '<',
};


// Part 1
(function () {
	const SCORE = {
		')': 3,
		']': 57,
		'}': 1197,
		'>': 25137,
	};

	function getLineScore(line) {
		const stack = [];

		for (let i = 0; i < line.length; i++) {
			const bracket = line[i];
			if (OPENING_BRACKETS.includes(bracket)) {
				stack.push(bracket);
			} else {
				const openingBracket = stack.pop();
				const expectedOpeningBracket = MATCHES[bracket];
				if (openingBracket !== expectedOpeningBracket) {
					return SCORE[bracket];
				}
			}
		}

		return 0;
	}

	const totalScore = lines.reduce((score, line) => (score + getLineScore(line)), 0);
	console.log(totalScore);
})();

// Part 2
(function () {
	const SCORE = {
		'(': 1,
		'[': 2,
		'{': 3,
		'<': 4,
	};

	/**
	 * 
	 * @param {string[]} line 
	 * @returns {number}
	 */
	function getLineScore(line) {
		const stack = [];

		for (let i = 0; i < line.length; i++) {
			const bracket = line[i];
			if (OPENING_BRACKETS.includes(bracket)) {
				stack.push(bracket);
			} else {
				const openingBracket = stack.pop();
				const expectedOpeningBracket = MATCHES[bracket];
				if (openingBracket !== expectedOpeningBracket) {
					// Line is corrupted, not incomplete. Ignore line.
					return 0;
				}
			}
		}

		let score = stack.reduceRight((score, openingBracket) => {
			return (score * 5) + SCORE[openingBracket];
		}, 0);
		return score;
	}

	const scores = lines
		.map(getLineScore)
		.filter(x => x > 0)
		.sort((a, b) => a - b);
	const median = scores[Math.floor(scores.length / 2)];
	console.log(median);
})();