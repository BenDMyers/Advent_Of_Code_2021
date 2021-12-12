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

const SCORE = {
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
};

// Part 1
(function () {
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