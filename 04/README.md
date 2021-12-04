# [Day 4](https://adventofcode.com/2021/day/4)

In **Day 4**, you're playing bingo. You're given a comma-separated list of numbers that get called, as well as a series of 5×5 grids of numbers — the bingo cards.

In **Part 1**, the goal is to figure out which bingo card would win first, and add up any of its remaining numbers. In **Part 2**, the goal is to figure out which bingo card would finish *last*, keep playing until it finishes, and then add up any of its remaining numbers.

## Setup

Two things seemed key to being able to solve this problem and debug along the way:

1. Figuring out a how to represent the bingo cards - in particular, how best to represent the numbers that had already been called.
2. Breaking up logic into functions that solved small, specific tasks well (this seemed especially critical in Part 1, when I had no idea what Part 2 would bring!)

# Representing Bingo Cards and Called Numbers

The gridlike structure of the bingo cards absolutely called for two-dimensional arrays… but how best to represent which numbers have been checked? There's a bunch of different ways you could do this, including…

1. Maintaining two separate two-dimensional arrays for each bingo card — one with the numbers, and one with booleans for whether each space has been called
2. A two-dimensional array of `{number: Number, called: Boolean}` objects
3. A two-dimensional array of numbers where you don't track which spaces have been called, but instead go through the whole list of called numbers every time you check a cell when determining the bingo card's victory status
4. A two-dimensional array of numbers, but you replace the number with a non-numeric value when it's been called

Of these options, **1** seemed too memory-intensive and difficult to orchestrate for many bingo cards. **2** would absolutely have worked, but I thought of it too late 😅. **3** would constantly recalculate the calledness of cells over and over again.

Thus… I landed on **4**. I decided to represent each bingo card as a two-dimensional array of numbers, and when a given number was called, I'd replace it with `false` in the bingo card.

## Small(ish), Specific Functions

In Advent of Code, Part 2 includes twists on Part 1 that often make it very difficult to copy your logic from part to part wholesale. Since your logic for Part 1 can be complex, this sometimes means a whole rework is in order to solve Part 2. However, by breaking out core tasks into reusable functions, we can salvage pieces of our solution and reuse them in Part 2. These functions also make it much, much easier to test pieces of our logic independently to ensure they work the way we expect.

For this bingo logic, I figured two pieces of my logic could really, *really* benefit from being extracted to their own function:

1. Determining whether a bingo card is in a winning state ([`getIsWinner()`](https://github.com/BenDMyers/Advent_Of_Code_2021/blob/main/04/index.js#L9-L39))
2. Updating a bingo card to mark a number as called ([`markCalledNumber()`](https://github.com/BenDMyers/Advent_Of_Code_2021/blob/main/04/index.js#L41-L54))

Of these two, I think `markCalledNumber()` served as a nicety, but `getIsWinner()` proved absolutely clutch.

## Labels!

Speaking of `getIsWinner()`… this puzzle gave me a chance to use a less common JavaScript feature: [labels](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label).

Consider this `for` loop used to determine whether any *rows* of a bingo card have had all of their numbers called:

```js
for (let row = 0; row < board.length; row++) {
	let winner = true;

	for (let col = 0; col < board[row].length; col++) {
		if (board[row][col] !== false) {
			winner = false;
		}
	}

	if (winner) {
		return true;
	}
}
```

This iterates through each row of the bingo card. For each row, it iterates over the columns, ensuring that each column has been called. As it goes, it uses a boolean flag (called `winner`) to keep track of whether this is still a winning row. If any numbers in the row have *not* been called, `winner` is set to false. If, at the end of the row, winner is still `true`, we know that this is a winning row, and so we return `true`. Otherwise, we move on to the next row.

This solution works. However… it's missing a nice optimization. Currently, if a row is determined not to be a winner early on, we still check the remaining columns anyways. Ideally, once we know that a row is not a winner, we should skip the rest of the row and move on to the next row.

We can use JavaScript labels for this! Consider this [following excerpt from `getIsVictory`](https://github.com/BenDMyers/Advent_Of_Code_2021/blob/main/04/index.js#L16-L25):

```js
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
```

This approach *labels* the outer `for` loop "`rows`." It iterates through the rows and through the columns the same way the previous loop does, but now, whenever we find a number that hasn't been called yet, we instead execute `continue rows;`. This tells JavaScript to move on to the next iteration of the `for` loop — this row is no good. Since the final input had *100* 5×5 bingo cards, I'm confident this sped up calculations quite a bit.

## Part 1 Breakdown

With the [data structure](#setup) and [helper functions](#smallish-specific-functions) in place, it was time to solve Part 1.

**Part 1** asks you to find the first bingo card from the list that would win and then add up all of its uncalled numbers. My approach to this was to…

1. Shift (pop the first) number from the list of all called numbers, and then mark it on all game boards:
```js
let called = calledNumbers.shift();
boards.forEach(board => markCalledNumber(board, called));
```

2. Keep doing this until one of the boards is a winner:
```js
while (!boards.some(getIsVictory)) {
	let called = calledNumbers.shift();
	boards.forEach(board => markCalledNumber(board, called));
}
```

3. Get the winning board and its sum:
```js
while (!boards.some(getIsVictory)) {
	let called = calledNumbers.shift();
	boards.forEach(board => markCalledNumber(board, called));
}

const winningBoard = boards.find(getIsWinner);
const sum = winningBoard
	.flat() // Convert two-dimensional array to one-dimensional array
	.filter(x => x) // Filter out falsy values
	.reduce((total, num) => total + num) // Sum up remaining values
```

4. Ensure I can access the most recently called number outside the scope of the `while` loop, and get the product of the sum and called number:
```js
let called;
while (!boards.some(getIsWinner)) {
	called = calledNumbers.shift();
	boards.forEach(board => markCalledNumber(board, called));
}

const winningBoard = boards.find(getIsWinner);
const sum = winningBoard
	.flat()
	.filter(x => x)
	.reduce((total, num) => total + num)

console.log(called * sum);
```

## Part 2 Breakdown

While I handled Part 2 in its own scope, separate from Part 1, Part 2 is really a continuation of Part 1. Keep calling numbers until the *last* bingo card finishes. Then get its sum, and multiply it by the most recent number to get called.

1. Shift (pop the first) number from the list of all called numbers, and then mark it on all game boards:
```js
let called = calledNumbers.shift();
boards.forEach(board => markCalledNumber(board, called));
```

2. Filter out all winning boards:
```js
let called = calledNumbers.shift();
boards.forEach(board => markCalledNumber(board, called));
boards = boards.filter(board => !getIsWinner(board));
```

3. Keep going until only one board is left. Now you have your losing board:
```js
while (boards.length > 1) {
	let called = calledNumbers.shift();
	boards.forEach(board => markCalledNumber(board, called));
	boards = boards.filter(board => !getIsWinner(board));
}
```

4. Keep calling numbers until your losing board finishes:
```js
while (boards.length > 1) {
	// ...
}

const [losingBoard] = boards;
while (!getIsWinner(losingBoard)) {
	let called = calledNumbers.shift();
	markCalledNumber(losingBoard, called);
}
```

5. Get the sum and the most recently called number, and multiply:
```js
let called;

while (boards.length > 1) {
	called = calledNumbers.shift();
	boards.forEach(board => markCalledNumber(board, called));
	boards = boards.filter(board => !getIsWinner(board));
}

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

console.log(called * sum);
```