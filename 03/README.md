# [Day 3](https://adventofcode.com/2021/day/3)

In Day 3, each line in your input is a bitstring — something like:

```
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
```

Both parts of the puzzle require figuring out which bit is most common at a given position.

I initially found this question a little confusing, and had to take a couple stabs at it. Once I had a working solution, I wasn't happy with how messy it felt, so I archived it as [`original.js`](/03/original.js) and started from scratch.

## Easy Switching Between Test Input and Puzzle Input

As part of building my solution anew, I realized I wasn't thrilled with how I'd been handling my input files. My previous puzzle boilerplate always read input from a `.input` file (which I've `.gitignore`'d out of respect for the puzzle developers). This meant that if I needed to go back and forth between the test data provided as an example in the puzzle description and the real data needed to solve the puzzle, I needed to swap out the contents of `.input`.

Now, I've set it up to where if you include the `--test` flag while running the day's code, it will read from a `.test` file — which has the simpler, thoroughly explained test data, which I'm more comfortable committing.

## `getMostCommonBit`

When I [initially solved Part 1](#part-1), I solved it by first munging the input into a two-dimensional array, and then iterating over that. It wasn't until I got to [Part 2](#part-2) for the first time that I realized it might be helpful to have a [reusable `getMostCommonBit` function](https://github.com/BenDMyers/Advent_Of_Code_2021/blob/main/03/original.js#L40-L64).

The [`getMostCommonBit`](https://github.com/BenDMyers/Advent_Of_Code_2021/blob/main/03/index.js#L11-L35) function as it exists now is pretty minimal. It takes a list of bitstrings, and the current index or position within the strings to check the bit of. It keeps track of how many bitstrings have a `0` in that position, and how many have a `1`. Then it returns `'0'` or `'1'` — whichever had more.

```js
/**
 * Gets the most common bit at a given position for a list of bitstrings.
 * Defaults to `1` in the case of a tie.
 * @param {string[]} bitstrings - list of bitstrings
 * @param {number} index - current position within the index
 * @returns {'0' | '1'} - most common bit at that position
 */
function getMostCommonBit(bitstrings, index) {
	let zeroes = 0;
	let ones = 0;

	for (const bitstring of bitstrings) {
		if (bitstring.charAt(index) === '0') {
			zeroes++;
		} else {
			ones++;
		}
	}

	if (ones >= zeroes) {
		return '1';
	} else {
		return '0';
	}
}
```

There's a sneaky little bit (ha.) in there — the use of `>=` in the `if (ones >= zeroes)` check. This doesn't matter for Part 1 at all, but it matters for Part 2 once lists start getting filtered.

Per Part 2, when you're looking for the *most* common bit at a given position, ties should be treated as though `1` was the most common bit. When you're looking for the *least* common bit, ties should be treated as though `0` was the least common bit. These two statements are equivalent, as far as I was concerned. When in doubt, there's more ones than zeroes. By using `>=`, we handle that tie-breaking.

## Part 1

In Part 1, we're tasked with creating two new bitstrings. The *gamma* bitstring is comprised of the most common bits at each position, and the *epsilon* bitstring is comprised of the least common bits at each position. This means that the gamma and epsilon strings are perfect inverses of each other. For instance, if the gamma string is `10101`, then epsilon is `01010`.

I chose to track both strings as separate variables. However, because they're inverses of each other, I probably could have derived epsilon from gamma using [bitwise operators](https://www.w3schools.com/js/js_bitwise.asp). This is almost definitely worth exploring.

Originally, I tried to solve Part 1 by converting the input into a two-dimensional array, and iterating over it using nested `for`-loops. This led to a lot of data munging and unmunging that I really wasn't thrilled with, so I cleaned it up in the new version of `index.js`. Aside from the data munging I hadn't been doing, the new approach wasn't fundamentally, *algorithmically* all that different from how I was originally doing things — it's just a lot cleaner.

The finished approach now looks like:

```js
let gammaBitstring = '';
let epsilonBitstring = '';

for (let i = 0; i < lines[0].length; i++) {
	if (getMostCommonBit(lines, i) === '0') {
		gammaBitstring += '0';
		epsilonBitstring += '1';
	} else {
		gammaBitstring += '1';
		epsilonBitstring += '0';
	}
}

let gamma = parseInt(gammaBitstring, 2);
let epsilon = parseInt(epsilonBitstring, 2);
console.log('Part 1', {
	gamma,
	epsilon,
	product: gamma * epsilon
});
```

(In my original solution, the `getMostCommonBit` part was handled in line, using array operations and iterations)

## Part 2

Part 2 introduces some iterative filtering of the bitstring lists.

First, it defines the *oxygen generator rating*. Start with your complete list of bitstrings. Figure out the most common bit in position 0. Filter out all bitstrings that *don't* have that bit in position 0. Then figure out the most common bit in position 1 from the all of the remaining bitstrings. Filter out any of the remaining bitstrings that don't have that bit in position 1. Move on to positions 2, 3, etc., filtering out any bitstrings that don't have that most common bit until only one bitstring remains. This is your *oxygen generator rating.*

Similarly, the *CO<sub>2</sub> scrubber rating* follows the same iterative process, only in each round, you keep the bitstrings that have the *least* common bit at each position from among the remaining bitstrings.

Admittedly, what tripped me up for a while was that I didn't understand that I needed to find the most/least common bits *from the bitstrings that remained* from each round of filtering - so you can't just compare each bitstring to the gamma and epsilon strings from Part 1.

I ended up following the letter of the description pretty much to a T. Here's the oxygen generator rating calculation. (CO<sub>2</sub> scrubber rating is pretty much the same general pattern)


```js
let oxygenGeneratorCandidates = [...lines];
let oxygenGeneratorBitIndex = 0;

while (oxygenGeneratorCandidates.length > 1) {
	let mostCommonBit = getMostCommonBit(oxygenGeneratorCandidates, oxygenGeneratorBitIndex);
	oxygenGeneratorCandidates = oxygenGeneratorCandidates.filter((candidate) => (
		candidate.charAt(oxygenGeneratorBitIndex) === mostCommonBit
	));

	oxygenGeneratorBitIndex++;
}

const [oxygenGeneratorRatingBitstring] = oxygenGeneratorCandidates;
const oxygenGeneratorRating = parseInt(oxygenGeneratorRatingBitstring, 2);
```

I'm using a `while` loop to ensure I iterate only until the candidate list has only one candidate in it. Each round, I increment the bit index that I care about. I find out which bit is the most common at that position from the list of remaining candidates, and I filter out all bitstrings that don't have that bit in that position.

There are a couple of variations you could put on this. One is that after each round of filtering, you guarantee that each of the remaining candidate bitstrings must start with the same prefix - so instead of checking the `charAt`, you could instead confirm that the candidate starts with the current prefix:

```js
prefix += mostCommonBit;
oxygenGeneratorCandidates = oxygenGeneratorCandidates.filter((candidate) => candidate.startsWith(prefix));
```

I'm sure there are ways to optimize this even further, but at this point, I'm happy with the legibility of my code.