// Parse puzzle input
const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const [calledNumbersInput, ...boardsInput] = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n\n');

/**
 * Determines whether a board is in a win condition.
 * Numbers that have been called have been replaced with `false`.
 * @param {(number|false)[][]} board - two-dimensional of numbers, where called numbers have been replaced by `false`
 * @returns {boolean} true if the board is a winner, false otherwise
 */
function getBoardVictoryStatus(board) {
	// Check rows
	rows:
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			if (board[row][col] !== false) {
				continue rows;
			}
		}
		console.log({row})
		return true;
	}

	// Check columns
	columns:
	for (let col = 0; col < board[0].length; col++) {
		for (let row = 0; row < board.length; row++) {
			if (board[row][col] !== false) {
				continue columns;
			}
		}
		console.log({col})
		return true;
	}

	return false;
}

/**
 * 
 * @param {(number|false)[][]} board 
 * @param {number} calledNumber 
 */
function markCalledNumber(board, calledNumber) {
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			if (board[row][col] === calledNumber) {
				board[row][col] = false;
			}
		}
	}
}

// Part 1
(function() {
	const calledNumbers = calledNumbersInput.split(',').map(x => parseInt(x));
	const boards = boardsInput.map(board => board.split('\n').map(row => row.trim().split(/\s+/).map(cell => parseInt(cell))));

	let called;
	while (!boards.some(getBoardVictoryStatus)) {
		called = calledNumbers.shift();
		boards.forEach(board => markCalledNumber(board, called));
	}
	
	const [winningBoard] = boards.filter(getBoardVictoryStatus);
	const sum = winningBoard
		.flat() // Convert two-dimensional array to one-dimensional array
		.filter(x => x) // Filter out falsy values
		.reduce((total, num) => total + num) // Sum up remaining values
	
	console.log({
		winningBoard,
		called,
		sum,
		product: sum * called
	});
})();

// Part 2
(function() {
	const calledNumbers = calledNumbersInput.split(',').map(x => parseInt(x));
	let boards = boardsInput.map(board => board.split('\n').map(row => row.trim().split(/\s+/).map(cell => parseInt(cell))));

	let called;
	while (boards.length > 1) {
		called = calledNumbers.shift();
		boards.forEach(board => markCalledNumber(board, called));
		boards = boards.filter(board => !getBoardVictoryStatus(board));
	}

	const [losingBoard] = boards;
	while (!getBoardVictoryStatus(losingBoard)) {
		called = calledNumbers.shift();
		markCalledNumber(losingBoard, called);
	}

	const sum = losingBoard
		.flat() // Convert two-dimensional array to one-dimensional array
		.filter(x => x) // Filter out falsy values
		.reduce((total, num) => total + num) // Sum up remaining values
	
	console.log({
		losingBoard,
		called,
		sum,
		product: sum * called
	});
})()