# [Day 1](https://adventofcode.com/2021/day/1)

In Day 1's puzzle, your given a list of numbers. **Part 1** asks you to count the number of times the numbers increase as you go from one element to the next — in other words, the number of elements in the array which are greater than the elements right before them.

For me, the simplest approach was a `for`-loop iterating over each element, comparing it to the one right before it:

```js
for (let i = 1; i < lines.length; i++) {
	if (lines[i] > lines[i - 1]) {
		numIncreases++;
	}
}
```

We start at `i = 1` because that starts us at the second element — which is the first element to have an element right before it.

**Part 2** asks us to instead envision a rolling sum of three consecutive elements going along the array, and to count how many times the rolling sum is greater than the rolling sum right before it.

I chose to solve this by keeping track of the previous rolling sum:

```js
let numSlidingWindowIncreases = 0;
let previousWindow = Number.MAX_SAFE_INTEGER;

for (let i = 2; i < lines.length; i++) {
	let window = lines[i - 2] + lines[i - 1] + lines[i];
	if (window > previousWindow) {
		numSlidingWindowIncreases++;
	}

	previousWindow = window;
}
```

However, you don't need to keep track of this - you could calculate it each time:

```js
let previousWindow = lines[i - 3] + lines[i - 2] + lines[i - 1];
let currentWindow = lines[i - 2] + lines[i - 1] + lines[i];

if (currentWindow > previousWindow) {
	numSlidingWindowIncreases++;
}
```

However, this would require adapting the start and end points for the loop, and I found the "store the previous rolling sum" approach a little easier to reason about.