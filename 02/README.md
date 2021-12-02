# [Day 2](https://adventofcode.com/2021/day/2)

A pretty common staple for Advent of Code is what I might call the direction-and-distance instruction puzzle, where each line contains a direction to go and distance to go in that direction.

This time, commands were `forward`, `up`, and `down`, each followed by a number. See [the puzzle](https://adventofcode.com/2021/day/2) for the specifics on how these commands were used in both parts.

For direction-and-distance puzzles, the key is in interpreting each instruction… and this remains fairly constant from year to year. The solution pattern that seems to work best for me is to first **munge the input instructions** into their respective parts, and then to iterate over them and **use a `switch` statement** to handle each direction separately.

## Munging the Input Instructions

Each line in the input file is an instruction, and each instruction contains a *direction* followed by a *number*.

For each line in the file, I follow these steps:

* Split the line up by spaces, so that `'forward 8'` becomes `['forward', '8']`
* Convert the second element of the array, which is the amount, into a number type
* Return a new array which contains the first word and the newly-number-typed amount: `['forward', 8]`

That munging in practice looks like:

```js
const lines = fs
	.readFileSync(`${__dirname}/.input`, 'utf-8')
	.split('\n')
	.map(line => {
		const [direction, amountString] = line.split(' ');
		const amount = Number(amountString);
		return [direction, amount];
	});
```

This munging means that as I work with this data throughout the rest of my code, it's as easy to work with as possible.

```js
[
	['forward', 8],
	['down', 9],
	['up', 4]
]
```

## Following Directions

With each line now split into its direction and its distance, it's time to follow each instruction. For me, this formula has three parts:

1. Establish global variables for your progress in each relevant direction.
2. Create a `for`-loop which iterates all of the munged input instructions.
3. Inside that `for`-loop, process the *direction* using a `switch` statement, where each possible direction type is its own `case`.

In this case, that looked like:

```js
// Establish global progress variables
let horizontalPosition = 0;
let depth = 0;

// Iterate over munged instructions
for (const step of lines) {
	const [direction, amount] = step;

	// Process each possible direction as a case in a `switch` statement
	switch (direction) {
		case 'forward':
			horizontalPosition += amount;
			break;
		case 'down':
			depth += amount;
			break;
		case 'up':
			depth -= amount;
			break;
	}
}

console.log(horizontalPosition * depth);
```

This formula tends to be pretty handy to keep in mind for solving Advent of Code problems.