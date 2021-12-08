const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;

let crabs = fs
	.readFileSync(inputPath, 'utf-8')
	.split(',')
	.map((horizontalPosition) => parseInt(horizontalPosition));

let min = Math.min(...crabs);
let max = Math.max(...crabs);

// Part 1
(function () {
	let minimumFuelRequired = Number.MAX_SAFE_INTEGER;
	let optimalHorizontalPosition = -1;

	for (let horizontal = min; horizontal <= max; horizontal++) {
		let fuelRequired = crabs.reduce((fuel, crabPosition) => {
			let necessaryFuelForCrab = Math.abs(horizontal - crabPosition);
			return fuel + necessaryFuelForCrab;
		}, 0);

		if (fuelRequired < minimumFuelRequired) {
			minimumFuelRequired = fuelRequired;
			optimalHorizontalPosition = horizontal;
		}
	}

	console.log({minimumFuelRequired, optimalHorizontalPosition});
})();

// Part 2
(function () {
	/**
	 * Gets the fuel required to get a crab's submarine to span a given distance
	 * @param {number} distance 
	 * @returns {number} fuel required
	 */
	function getFuelRequired(distance) {
		let fuelRequired = 0;
		for (let i = 1; i <= distance; i++) {
			fuelRequired += i;
		}
		return fuelRequired;
	}

	let minimumFuelRequired = Number.MAX_SAFE_INTEGER;
	let optimalHorizontalPosition = -1;

	for (let horizontal = min; horizontal <= max; horizontal++) {
		let fuelRequired = crabs.reduce((fuel, crabPosition) => {
			let distance = Math.abs(horizontal - crabPosition);
			let necessaryFuelForCrab = getFuelRequired(distance);
			return fuel + necessaryFuelForCrab;
		}, 0);

		if (fuelRequired < minimumFuelRequired) {
			minimumFuelRequired = fuelRequired;
			optimalHorizontalPosition = horizontal;
		}
	}

	console.log({minimumFuelRequired, optimalHorizontalPosition});
})();