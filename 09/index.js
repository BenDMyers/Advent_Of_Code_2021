const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const heightmap = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n')
	.map(line => line
		.split('')
		.map(digit => Number(digit)));

let lowPoints = [];

// Part 1
(function () {
	/**
	 * Get the heights for a cells adjacent to the specified cell
	 * @param {number} row 
	 * @param {number} col 
	 * @returns {number[]} adjacent heights
	 */
	 function getSurroundingHeights(row, col) {
		const hasUp = row > 0;
		const hasDown = row < (heightmap.length - 1);
		const hasLeft = col > 0;
		const hasRight = col < (heightmap[row].length - 1);
	
		const surroundingHeights = [];
		if (hasUp) {
			surroundingHeights.push(heightmap[row - 1][col]);
		}
		if (hasDown) {
			surroundingHeights.push(heightmap[row + 1][col]);
		}
		if (hasLeft) {
			surroundingHeights.push(heightmap[row][col - 1]);
		}
		if (hasRight) {
			surroundingHeights.push(heightmap[row][col + 1]);
		}
	
		return surroundingHeights;
	}

	let sumOfRiskLevels = 0;

	for (let row = 0; row < heightmap.length; row++) {
		for (let col = 0; col < heightmap[row].length; col++) {
			const height = heightmap[row][col];
			const minSurroundingHeight = Math.min(...getSurroundingHeights(row, col));
			if (height < minSurroundingHeight) {
				lowPoints.push({row, col});
				let riskLevel = 1 + height;
				sumOfRiskLevels += riskLevel;
			}
		}
	}

	console.log(sumOfRiskLevels);
})();

// Part 2
(function () {
	/** @type {number[][]} */
	const basins = [];
	for (let i = 0; i < heightmap.length; i++) {
		basins[i] = new Array(heightmap[i].length);
	}

	/**
	 * Gets all neighboring cells within the bounds of the heightmap
	 * @param {{row: number, col: number}} location 
	 * @returns {{row: number, col: number}[]}
	 */
	function getAllNeighbors(location) {
		const {row, col} = location;
		const hasUp = row > 0;
		const hasDown = row < (heightmap.length - 1);
		const hasLeft = col > 0;
		const hasRight = col < (heightmap[row].length - 1);

		const neighbors = [];
		if (hasUp) {
			neighbors.push({row: row - 1, col});
		}
		if (hasDown) {
			neighbors.push({row: row + 1, col});
		}
		if (hasLeft) {
			neighbors.push({row, col: col - 1});
		}
		if (hasRight) {
			neighbors.push({row, col: col + 1});
		}

		return neighbors;
	}

	/**
	 * Determines whether a given cell is already marked as being in a basin
	 * @param {{row: number, col: number}} location 
	 * @returns {boolean}
	 */
	function isUnclaimed(location) {
		const {row, col} = location;
		return !basins[row][col];
	}

	/**
	 * 
	 * @param {{row: number, col: number}} location 
	 */
	function getHeight(location) {
		const {row, col} = location;
		return heightmap[row][col];	
	}

	/**
	 * 
	 * @param {{row: number, col: number}} location 
	 * @param {number} basinId
	 */
	function calculateBasin(location, basinId) {
		const {row, col} = location;
		const height = heightmap[row][col];

		basins[row][col] = basinId;
		
		const flowingNeighbors = getAllNeighbors(location)
			.filter(isUnclaimed)
			.filter(neighbor => {
				const neighborHeight = getHeight(neighbor);
				return (neighborHeight < 9) && (neighborHeight > height);
			})

		flowingNeighbors.forEach(neighbor => calculateBasin(neighbor, basinId));
	}

	lowPoints.forEach(calculateBasin);
	// for (let i = 0; i < basins.length; i++) {
	// 	let row = '';
	// 	for (let j = 0; j < basins[i].length; j++) {
	// 		row += basins[i][j] ?? '.';
	// 	}
	// 	console.log(row);
	// }
	let basinFrequencies = basins.flat().sort();
	const basinSizes = [];
	do {
		let basinId = basinFrequencies[0];
		let totalBasinCells = basinFrequencies.length;
		basinFrequencies = basinFrequencies.filter(id => (id !== basinId));
		let remainingBasinCells = basinFrequencies.length;
		let basinSize = totalBasinCells - remainingBasinCells;
		basinSizes.push(basinSize);
	} while (basinFrequencies.length > 0)
	basinSizes.sort((a, b) => b - a);
	const [first, second, third] = basinSizes;
	console.log(first * second * third);
})();