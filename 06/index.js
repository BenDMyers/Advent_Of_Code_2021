const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;

let lanternfishInput = fs
	.readFileSync(inputPath, 'utf-8')
	.split(',')
	.map((timer) => parseInt(timer));

const NUM_DAYS = 80;
let part1Lanternfish = [...lanternfishInput];

console.log(0, part1Lanternfish);
for (let i = 1; i <= NUM_DAYS; i++) {
	let nextDayLanternfish = part1Lanternfish.map(timer => timer - 1);
	for (let j = 0; j < part1Lanternfish.length; j++) {
		if (nextDayLanternfish[j] === -1) {
			nextDayLanternfish[j] = 6;
			nextDayLanternfish.push(8);
		}
	}
	console.log(i, nextDayLanternfish);
	part1Lanternfish = nextDayLanternfish;
}

console.log(part1Lanternfish.length);