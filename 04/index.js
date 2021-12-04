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
 * @param {(number|false)[][]} board - two-dimensional array of numbers, where called numbers have been replaced by `false`
 * @returns {boolean} true if the board is a winner, false otherwise
 */
function getIsWinner(board) {
	// Check rows
	rows:
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			if (board[row][col] !== false) {
				continue rows;
			}
		}
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
		return true;
	}

	return false;
}

/**
 * Marks the called number as `false` in the given board
 * @param {(number|false)[][]} board - two-dimensional array of numbers, where called numbers have been replaced by `false`
 * @param {number} calledNumber - most recently called number; all instances of this number in `board` will be replaced with `false`
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

	// Keep playing rounds of bingo until one board wins
	let called;
	while (!boards.some(getIsWinner)) {
		called = calledNumbers.shift();
		boards.forEach(board => markCalledNumber(board, called));
	}
	
	// Determine score of winning board (sum of all remaining values)
	const winningBoard = boards.find(getIsWinner);
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

	// Determine which board is the last board to win
	let called;
	while (boards.length > 1) {
		called = calledNumbers.shift();
		boards.forEach(board => markCalledNumber(board, called));
		boards = boards.filter(board => !getIsWinner(board));
	}

	// Keep playing until the losing board wins
	const [losingBoard] = boards;
	while (!getIsWinner(losingBoard)) {
		called = calledNumbers.shift();
		markCalledNumber(losingBoard, called);
	}

	// Determine score of losing board (sum of all remaining values)
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