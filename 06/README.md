# [Day 6](https://adventofcode.com/2021/day/6)

In **Day 6**, you're introduced to a school of lanternfish that, uh, multiply. A lanternfish births another lanternfish 9 days after it itself was born, and then again every 7 days after that. Given an initial list of lanternfish who are each already a different number of days old… how many lanternfish will there be after a certain number of days?

**Part 1** asks how many lanternfish will there be after 80 days. **Part 2** asks how many will there be after *256* days.

## Part 1 and a Naïve Approach

In the wording of the puzzle, the lanternfish are arranged as a list, such as `3,4,3,1,2`. Newborn fish are described as getting added to the end of the list. And so for Part 1… I went with a list, an array of numbers which each represented how many days until that lanternfish gives birth again.

To process days, I iterated with a `for`-loop from Day 0 to Day 80. Within each day, I created a new array that was a copy of the previous day's array, but with each day timer subtracted by one. Then, I scanned through the array and, for every `-1`, I replaced that `-1` with a `6` to restart that fish's counter and I pushed an `8` at the end of the array to start a new lanternfish's clock. After all 80 days were up, I took the length of the array, and that was the number of lanternfish.

This was fine and all, until…

## Part 2 😅

**Part 2** asks you to up the measurement from 80 days to 256 days. I wanted to see if my solution would work for 256 days, so I ran it and…

```
<--- Last few GCs --->

[50011:0x1046f1000]    32748 ms: Scavenge 2610.6 (2644.2) -> 2610.6 (2644.2) MB, 85.4 / 0.0 ms  (average mu = 0.898, current mu = 0.893) allocation failure


<--- JS stacktrace --->

FATAL ERROR: invalid array length Allocation failed - JavaScript heap out of memory
```

After 144 days, the lanternfish array had grown too big, and the program was out of memory. It was clear that I was going to have to find another way.

There is almost definitely an exponential formula that could solve this problem, and do it in [constant runtime](https://en.wikipedia.org/wiki/Time_complexity#Constant_time). However, I don't have enough faith in my ability to derive exponential formulae 😅

There was something I could use, a solution that often helps pare down really large problem sets: recursion. After all, the fish with a timer of `3` on Day 0 would birth a fish on Day 4, a fish on Day 11, a fish on Day 18, and so forth. The Day 4 fish would birth fish on Days 13, 20, 27… you get the gist. At the end of the time, the timer-`3` fish would be responsible for itself, the Day 4 fish and its descendants, the Day 11 fish and its descendants, the Day 18 fish and its descendants, and so forth. This drilling down of fish giving birth to fish giving birth to fish seemed well suited for recursion.

For this recursive approach, the **base case** will be if the lanternfish was born too late to reproduce before time is up. The recursive case will handle any fish that manage to birth more fish.

### Step 1: Can This Fish Reproduce?

Before our program can recurse, it needs to know if a given fish will reproduce before time is up. Additionally, if it will recurse, it will need to know which fish are birthed as a result. I handled this in one go with a single function: [`getAllDatesForGivingBirth`](https://github.com/BenDMyers/Advent_Of_Code_2021/blob/main/06/index.js#L57-L78).

This function takes the current lanternfish's birthday, and it returns an array of any subsequent days on which that lanternfish will give birth. If the lanternfish won't give birth, then this function returns an empty array.

```js
/**
 * Get a list of all days on which this lanternfish will birth another
 * @param {number} birthday - the day this lanternfish was born
 * @returns {number[]} a list of birthdays for this lanternfish's children
 */
function getAllDatesForGivingBirth(birthday) {
	// Lanternfish was born too late to birth any fish before time is up
	if ((birthday + 9) > NUM_DAYS) {
		return [];
	}

	let datesForGivingBirth = [];
	for (
		let nextDateToGiveBirth = birthday + 7 + 2;
		nextDateToGiveBirth < NUM_DAYS;
		nextDateToGiveBirth += 7
	) {
		datesForGivingBirth.push(nextDateToGiveBirth);
	}

	return datesForGivingBirth;
}
```

### Step 2: Okay, Now We Get to the Recursion

The *core* logic for my recursive function, [`getFishInSubtree`](https://github.com/BenDMyers/Advent_Of_Code_2021/blob/main/06/index.js#L35-L55), is:

```js
/**
 * Each lanternfish's lineage is a subtree of it, its children, its grandchildren and so forth.
 * Find out how many lanternfish are in a given fish's subtree (including itself)
 * @param {number} birthday 
 * @returns {number} count of lanternfish in subtree
 */
function getFishInSubtree(birthday) {
	const thisFish = 1;
	const birthingDays = getAllDatesForGivingBirth(birthday);
	const descendants = birthingDays.reduce((sum, birthday) => (sum + getFishInSubtree(birthday)), 0);

	return thisFish + descendants;
}
```

`getFishInSubtree` uses that `getAllDatesForGivingBirth` helper function defined above to determine the birthday of any lanternfish this fish births. For each of those lanternfish, this function calls itself to get the number of lanternfish in *that* subtree. When the `birthingDays` array is empty and no lanternfish will be birthed, that is the base case, and that instance of `getFishInSubtree` will return exactly `1`. Each level above that sums up all of the lanternfish within the children's subtrees, and surface that sum up the stack trace.

But there's still more we could do.

### Step 3: Memoize, Memoize, Memoize

Recursion will solve this problem, but it has a strong potential to retread already solved ground. Say, for instance, you've already figured out how many lanternfish are in a subtree for a lanternfish born on Day 11. If you later need to know how many lanternfish are in a Day 11 lanternfish's subtree again, it would be incredibly wasteful to recompute it.

One solution to this is [memoization](https://en.wikipedia.org/wiki/Memoization): store the results of expensive operations, so that the next time you need to get that result, you can use the saved one instead of recomputing it. Memoization frequently comes in handy for recursive problems.

Let's retool our recursive logic from Step 2 to leverage memoization:

```js
/** @type {Object<number, number>} */
const lanternfishDescendantMemo = {};

/**
 * Each lanternfish's lineage is a subtree of it, its children, its grandchildren and so forth.
 * Find out how many lanternfish are in a given fish's subtree (including itself)
 * @param {number} birthday 
 * @returns {number} count of lanternfish in subtree
 */
function getFishInSubtree(birthday) {
	// If we already know how many fish are in this subtree, use that
	if (lanternfishDescendantMemo[birthday]) {
		return lanternfishDescendantMemo[birthday];
	}

	const thisFish = 1;
	const birthingDays = getAllDatesForGivingBirth(birthday);
	const descendants = birthingDays.reduce((sum, birthday) => (sum + getFishInSubtree(birthday)), 0);

	// Memoize
	lanternfishDescendantMemo[birthday] = thisFish + descendants;

	return thisFish + descendants;
}
```

### Step 4: Put It All Together

We're nearly there — we've got our recursion all set up and memoized. Now we just need to start running it against our initial inputs. There's just one minor issue: our logic operates based on the days the lanternfish are born, but our input is given to us in the form of timers until the next day that these lanternfish give birth. Before we can use our inputs, we have to reverse engineer those lanternfishes' birthdays:

```js
const originalBirthdays = lanternfishInput.map(timer => timer - 9);
```

By subtracting nine days instead of seven, we can treat these lanternfish the same way as we treat their progeny: nine days until the first birth, and then remaining births every seven days after that. We don't have to work in any special logic to handle these being The Original Lanternfish, which is nice.

From there, we want to get the number of lanternfish in each of The Original Lanternfish's subtrees:

```js
const allLanternfish = originalBirthdays.reduce((sum, birthday) => sum + getFishInSubtree(birthday), 0);
```

And there we go! `allLanternfish` is the total number of lanternfish born in that time!

## Other Solutions

I want to shout out some folks in the [Party Corgi Discord server](https://www.partycorgi.com/) whose solutions were vastly different from mine:

- [Ten's solution](https://codepen.io/Tzyinc/pen/jOGWVyW?editors=0012)
- [Darrik's solution](https://github.com/mdarrik/advent-of-code-2021/blob/main/day-06/src/lib.rs), which is written in Rust