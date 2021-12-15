// Parse puzzle input
const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const lines = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n');

const riskLevels = lines.map(line => line.split('').map(riskLevel => Number(riskLevel)));

// Part 1
(function () {
	const WIDTH = riskLevels[0].length;
	const HEIGHT = riskLevels.length;

	/**
	 * 
	 * @param {Cell} currentCell
	 * @return {Cell[]}
	 */
	function getNeighbors(currentCell) {
		/** @type {Cell[]} */
		const neighbors = [];

		// Right neighbor
		if (currentCell.col < WIDTH - 1) {
			neighbors.push({row: currentCell.row, col: currentCell.col + 1});
		}

		// Bottom neighbor
		if (currentCell.row < HEIGHT - 1) {
			neighbors.push({row: currentCell.row + 1, col: currentCell.col});
		}

		return neighbors;
	}

	/**
	 * 
	 * @param {Cell} cell 
	 * @returns {boolean}
	 */
	function isEnd(cell) {
		const isLastRow = cell.row === HEIGHT - 1;
		const isLastCol = cell.col === WIDTH - 1;
		return isLastRow && isLastCol;
	}

	/**
	 * 
	 * @param {Cell} cell 
	 * @returns {boolean}
	 */
	 function isStart(cell) {
		const isFirst = cell.row === 0;
		const isFirstCol = cell.col === 0;
		return isFirst && isFirstCol;
	}

	/** @type {Object<string, number>} */
	const MEMOIZED_RISKS = {};

	/**
	 * 
	 * @param {Cell} cell 
	 * @returns {number}
	 */
	function getMinimumRisk(cell) {
		const memoKey = `${cell.row},${cell.col}`;
		if (MEMOIZED_RISKS[memoKey]) {
			return MEMOIZED_RISKS[memoKey];
		}

		const currentRisk = isStart(cell) ? 0 : riskLevels[cell.row][cell.col];

		if (isEnd(cell)) {
			return currentRisk;
		}

		const viableNeighbors = getNeighbors(cell);
		const risks = viableNeighbors.map(getMinimumRisk);
		const minRisk = Math.min(...risks) + currentRisk;

		MEMOIZED_RISKS[memoKey] = minRisk;
		return minRisk;
	}

	const minimumRisk = getMinimumRisk({col: 0, row: 0});
	console.log(minimumRisk);
})();

/**
 * @typedef {object} Cell
 * @property {number} row
 * @property {number} col
 */