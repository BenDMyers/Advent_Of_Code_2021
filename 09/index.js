const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const heightmap = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n')
	.map(line => line
		.split('')
		.map(digit => Number(digit)));

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
				let riskLevel = 1 + height;
				sumOfRiskLevels += riskLevel;
			}
		}
	}

	console.log(sumOfRiskLevels);
})();