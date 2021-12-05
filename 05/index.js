// Parse puzzle input
const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const lines = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n')
	.map((line) => {
		const [x1, y1, x2, y2] = line.matchAll(/\d+/g);
		return [[parseInt(x1), parseInt(y1)], [parseInt(x2), parseInt(y2)]];
	});

// Part 1

/**
 * 
 * @param {[[number, number], [number, number]]} line
 * @returns {boolean}
 */
function isHorizontal(line) {
	const [beginning, end] = line;
	const [, y1] = beginning;
	const [, y2] = end;
	return y1 === y2;
}

/**
 * 
 * @param {[[number, number], [number, number]]} line
 * @returns {boolean}
 */
 function isVertical(line) {
	const [beginning, end] = line;
	const [x1] = beginning;
	const [x2] = end;
	return x1 === x2;
}

const nondiagonalLines = lines.filter(line => (isHorizontal(line) || isVertical(line)));

/** @type {Object<String, Number>} */
const part1Field = {};

for (const line of nondiagonalLines) {
	if (isHorizontal(line)) {
		let [[x1, y], [x2]] = line;
		let beginning = Math.min(x1, x2);
		let end = Math.max(x1, x2);
		
		for (let i = beginning; i <= end; i++) {
			let key = `${i},${y}`;
			if (part1Field[key]) {
				part1Field[key]++;
			} else {
				part1Field[key] = 1;
			}
		}
	} else { // vertical
		let [[x, y1], [, y2]] = line;
		let beginning = Math.min(y1, y2);
		let end = Math.max(y1, y2);
		
		for (let i = beginning; i <= end; i++) {
			let key = `${x},${i}`;
			if (part1Field[key]) {
				part1Field[key]++;
			} else {
				part1Field[key] = 1;
			}
		}
	}
}

const numOverlaps = Object.values(part1Field).filter(count => count > 1).length;
console.log(numOverlaps);