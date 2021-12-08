# [Day 7](https://adventofcode.com/2021/day/7)

In Day 7, you're given an array of numbers, each representing a crab's submarine's horizontal position. The goal is to align the crabmarines to the same horizontal position using the least fuel possible. In **Part 1**, a crab spends 1 fuel for every 1 step of horizontal distance. In **Part 2**, each step of horizontal distance costs one *additional* fuel — so the first step costs 1 fuel, the second step costs another 2 fuel, the third step costs another 3 fuel, and so on.

## Part 1

My approach to solving this problem ended up being… pretty much by the books. I figured it wouldn't make sense for all the crabs to go further left than the leftmost crab's starting position, nor would they go further right than the rightmost crab's starting position. This gives us our bounds. Then, for each possible horizontal position in that range, calculate how much fuel it would take all crabs to get there. Compare that to the previous minimum fuel requirements and, if this horizontal alignment fuel would require less fuel for all crabs to get there, save this new minimum and that alignment point.

In code, that looks like:

```js
// Store the optimal horizontal alignment point
let minimumFuelRequired = Number.MAX_SAFE_INTEGER;
let optimalHorizontalPosition = -1;

// Go through the range of all possible horizontal alignment points
for (let horizontal = min; horizontal <= max; horizontal++) {
	// Figure out total fuel required to get all the crabs to this point
	let fuelRequired = crabs.reduce((fuel, crabPosition) => {
		// If a crab requires 1 fuel for every 1 unit of distance traveled,
		// then the fuel required is equal to its displacement.
		let necessaryFuelForCrab = Math.abs(horizontal - crabPosition);

		// Add it to the other crabs' fuel requirements
		return fuel + necessaryFuelForCrab;
	}, 0);

	// If this is better than the previous best fuel requirement, save it.
	if (fuelRequired < minimumFuelRequired) {
		minimumFuelRequired = fuelRequired;
		optimalHorizontalPosition = horizontal;
	}
}

console.log({minimumFuelRequired, optimalHorizontalPosition});
```

## Part 2

Part 2 adds the complication that the fuel required to traverse a distance grows the longer the distance is. The first unit of distance only requires 1 fuel, but the second unit of distance requires another 2 fuel, and the third unit requires another 3 fuel, and so on.

There is likely a constant-time formula I could have plugged the distance into to get the amount of fuel required. However, I managed to get it with a quick `for` loop:

```js
function getFuelRequired(distance) {
	let fuelRequired = 0;
	for (let i = 1; i <= distance; i++) {
		fuelRequired += i;
	}
	return fuelRequired;
}
```

From there, it was a matter of plugging in this new `getFuelRequired` function into the total fuel calculations in place of the distance:

```js
let minimumFuelRequired = Number.MAX_SAFE_INTEGER;
let optimalHorizontalPosition = -1;

for (let horizontal = min; horizontal <= max; horizontal++) {
	let fuelRequired = crabs.reduce((fuel, crabPosition) => {
		let distance = Math.abs(horizontal - crabPosition);
		let necessaryFuelForCrab = getFuelRequired(distance);
		return fuel + necessaryFuelForCrab;
	}, 0);

	if (fuelRequired < minimumFuelRequired) {
		minimumFuelRequired = fuelRequired;
		optimalHorizontalPosition = horizontal;
	}
}
```