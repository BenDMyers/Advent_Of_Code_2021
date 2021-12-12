const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
let octopi = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n')
	.map(line => line
		.split('')
		.map(octopus => Number(octopus))
	);

/**
 * 
 * @param {any[][]} grid 
 */
function printGrid(grid) {
	for (let row of grid) {
		console.log(row.join(''));
	}
}

/**
 * Gets a {row, col} for all adjacent octopi which are in bounds
 * @param {{row: number, col: number}} location 
 * @returns {{row: number, col: number}[]} list of locations of neighboring octopi
 */
 function getNeighboringOctopi(location) {
	const {row, col} = location;
	const hasUp = row > 0;
	const hasDown = row < (octopi.length - 1);
	const hasLeft = col > 0;
	const hasRight = col < (octopi[row].length - 1);

	const neighboringOctopi = [];
	if (hasUp && hasLeft) neighboringOctopi.push({row: row - 1, col: col - 1});
	if (hasUp) neighboringOctopi.push({row: row - 1, col});
	if (hasUp && hasRight) neighboringOctopi.push({row: row - 1, col: col + 1});
	if (hasLeft) neighboringOctopi.push({row, col: col - 1});
	if (hasRight) neighboringOctopi.push({row, col: col + 1});
	if (hasDown && hasLeft) neighboringOctopi.push({row: row + 1, col: col - 1});
	if (hasDown) neighboringOctopi.push({row: row + 1, col});
	if (hasDown && hasRight) neighboringOctopi.push({row: row + 1, col: col + 1});

	return neighboringOctopi;
}

let numFlashes = 0;

function step() {
	const flashedOctopi = {};

	// Increment all octopi's energy level by 1, and figure out which octopi are about to flash
	let readyToFlash = [];
	let newOctopi = [];
	for (let row = 0; row < octopi.length; row++) {
		let currentRow = [];
		newOctopi.push(currentRow);

		for (let col = 0; col < octopi[row].length; col++) {
			currentRow.push(octopi[row][col] + 1);
			if (newOctopi[row][col] > 9) {
				readyToFlash.push({row, col});
			}
		}
	}

	// Handle flashes
	do {
		let nextReadyToFlash = [];

		for (let flasher of readyToFlash) {
			const {row, col} = flasher;

			// If this octopus has already flashed this step, ignore.
			if (flashedOctopi[`${row},${col}`]) continue;

			// Mark as flashed
			flashedOctopi[`${row},${col}`] = true;
			numFlashes++;

			// Increment neighbors, and queue up any neighbors that are now also about to flash
			const neighbors = getNeighboringOctopi(flasher);
			neighbors.forEach(neighbor => {
				newOctopi[neighbor.row][neighbor.col]++;
				if (newOctopi[neighbor.row][neighbor.col] > 9) {
					nextReadyToFlash.push(neighbor);
				}
			});
		}

		readyToFlash = nextReadyToFlash;
	} while (readyToFlash.length > 0)

	// Reset all flashed octopi to 0
	for (const location of Object.keys(flashedOctopi)) {

		const [row, col] = location.split(',').map(num => Number(num));
		newOctopi[row][col] = 0;
	}

	octopi = newOctopi;
	return Object.keys(flashedOctopi).length;
}

// Part 1
let i = 0;
for (; i < 100; i++) {
	step();
}
console.log(numFlashes);

// Part 2
let flashesPerStep = 0;
let totalNumOctopi = octopi.flat().length;
while (flashesPerStep !== totalNumOctopi) {
	i++;
	flashesPerStep = step();
	printGrid(octopi);
}
console.log(i);