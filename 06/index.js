const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;

let lanternfishInput = fs
	.readFileSync(inputPath, 'utf-8')
	.split(',')
	.map((timer) => parseInt(timer));

const NUM_DAYS = 256;

// Part 1
(function() {
	let part1Lanternfish = [...lanternfishInput];
	
	for (let i = 1; i <= NUM_DAYS; i++) {
		let nextDayLanternfish = part1Lanternfish.map(timer => timer - 1);
		for (let j = 0; j < part1Lanternfish.length; j++) {
			if (nextDayLanternfish[j] === -1) {
				nextDayLanternfish[j] = 6;
				nextDayLanternfish.push(8);
			}
		}
		part1Lanternfish = nextDayLanternfish;
	}
	
	console.log(part1Lanternfish.length);
})();

// Part 2
(function () {
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

	/**
	 * Get a list of all days on which this lanternfish will birth another
	 * @param {number} birthday - the day this lanternfish was born
	 * @returns {number[]} a list of birthdays for this lanternfish's children
	 */
	function getAllDatesForGivingBirth(birthday) {
		// Lanternfish was born too late to birth any fish before time is up
		if ((birthday + 7 + 2) > NUM_DAYS) {
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

	const originalBirthdays = lanternfishInput.map(timer => timer - (7 + 2));
	const allLanternfish = originalBirthdays.reduce((sum, birthday) => sum + getFishInSubtree(birthday), 0);
	console.log(allLanternfish);
})()