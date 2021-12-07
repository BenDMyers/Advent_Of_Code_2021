const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;

let crabs = fs
	.readFileSync(inputPath, 'utf-8')
	.split(',')
	.map((horizontalPosition) => parseInt(horizontalPosition));

let min = Math.min(...crabs);
let max = Math.max(...crabs);

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