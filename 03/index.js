const fs = require('fs');
const lines = fs
	.readFileSync(`${__dirname}/.input`, 'utf-8')
	.split('\n')
	.map(line => line.split(''));


let gammaBits = '';
let epsilonBits = '';

for (let col = 0; col < lines[0].length; col++) {
	let zeroes = 0;
	let ones = 0;
	for (let row = 0; row < lines.length; row++) {
		let bit = lines[row][col];
		if (bit === '0') {
			zeroes++;
		} else {
			ones++;
		}
	}

	if (zeroes > ones) {
		gammaBits += '0';
		epsilonBits += '1';
	} else {
		gammaBits += '1';
		epsilonBits += '0';
	}
}

let gamma = Number.parseInt(gammaBits, 2);
let epsilon = Number.parseInt(epsilonBits, 2);
console.log(gamma * epsilon);

let oxygenRatingCandidates = [...lines];
let oxygenRatingBitPosition = 0;
while (oxygenRatingCandidates.length > 1) {
	oxygenRatingCandidates = oxygenRatingCandidates
		.filter(candidate => candidate[oxygenRatingBitPosition] === gammaBits.charAt(oxygenRatingBitPosition));
	
	console.log(oxygenRatingCandidates)
	oxygenRatingBitPosition++;
}

let co2RatingCandidates = [...lines];
let co2RatingBitPosition = 0;
while (co2RatingCandidates.length > 1) {
	co2RatingCandidates = co2RatingCandidates
		.filter(candidate => candidate[co2RatingBitPosition] === epsilonBits.charAt(co2RatingBitPosition));
	co2RatingBitPosition++;
}

const oxygenRating = parseInt(oxygenRatingCandidates[0].join(''), 2);
const co2Rating = parseInt(co2RatingCandidates[0].join(''), 2);

console.log({oxygenRating, co2Rating, lifeSupportRating: oxygenRating * co2Rating});