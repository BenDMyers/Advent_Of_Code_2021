// Parse puzzle input
const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const [dotsInput, instructionsInput] = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n\n');

let dots = dotsInput.split('\n');

const foldInstructions = instructionsInput
	.split('\n')
	.map(fold => {
		let [direction, line] = fold.split('=');
		return [direction, Number(line)];
	})

/**
 * 
 * @param {number} crease vertical line (y = ?) to fold over
 */
function foldUp(crease) {
	let dotsAfterFold = new Set();

	for (const dot of dots) {
		const [x, y] = dot.split(',').map(coord => Number(coord));

		if (y <= crease) {
			dotsAfterFold.add(dot);
		} else {
			let distanceFromDotToCrease = y - crease;
			let foldedY = y - (2 * distanceFromDotToCrease);
			let foldedDot = `${x},${foldedY}`;
			dotsAfterFold.add(foldedDot);
		}
	}

	dots = Array.from(dotsAfterFold);
}

/**
 * 
 * @param {number} crease horizontal line (x = ?) to fold over
 */
function foldLeft(crease) {
	let dotsAfterFold = new Set();

	for (const dot of dots) {
		const [x, y] = dot.split(',').map(coord => Number(coord));

		if (x <= crease) {
			dotsAfterFold.add(dot);
		} else {
			let distanceFromDotToCrease = x - crease;
			let foldedX = x - (2 * distanceFromDotToCrease);
			let foldedDot = `${foldedX},${y}`;
			dotsAfterFold.add(foldedDot);
		}
	}

	dots = Array.from(dotsAfterFold);
}

/**
 * 
 * @param {['fold along x' | 'fold along y', number]} instruction 
 */
function fold(instruction) {
	const [direction, crease] = instruction;
	if (direction === 'fold along y') {
		foldUp(crease);
	} else {
		foldLeft(crease);
	}
}

function printPaper() {
	let {maxX, maxY} = dots.reduce(({maxX, maxY}, dot) => {
		const [x, y] = dot.split(',').map(coord => Number(coord));
		return {maxX: Math.max(maxX, x), maxY: Math.max(maxY, y)};
	}, {maxX: 0, maxY: 0});

	let {minX, minY} = dots.reduce(({minX, minY}, dot) => {
		const [x, y] = dot.split(',').map(coord => Number(coord));
		return {minX: Math.min(minX, x), minY: Math.min(minY, y)};
	}, {minX: Number.MAX_SAFE_INTEGER, minY: Number.MAX_SAFE_INTEGER});

	let grid = [];
	for (let i = minY; i <= maxY; i++) {
		// console.log(maxX - minX + 1)
		grid.push(new Array(maxX - minX + 1).fill('.'));
	}

	
	for (const dot of dots) {
		const [x, y] = dot.split(',').map(coord => Number(coord));
		// console.log({dot, x, y, row: grid[y]})
		grid[y - minY][x - minX] = '#';
	}

	grid.forEach(row => console.log(row.join('')));
	console.log();
}

// Part 1
const [firstInstruction, ...remainingInstructions] = foldInstructions;

printPaper();
fold(firstInstruction);
console.log(dots.length);

// Part 2
remainingInstructions.forEach(fold);
printPaper();