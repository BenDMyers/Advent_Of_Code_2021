// Parse puzzle input
const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const lines = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n')
	.map(connection => connection.split('-'));

/** @type {Object<string, Set<string>} */
const connections = {};
for (let line of lines) {
	const [start, end] = line;

	if (!connections[start]) {
		connections[start] = new Set();
	}
	connections[start].add(end);

	if (!connections[end]) {
		connections[end] = new Set();
	}
	connections[end].add(start);
}

for (let connection in connections) {
	connections[connection] = Array.from(connections[connection]);
}

console.log(connections);

// Part 1
(function () {
	/**
	 * Recursively determines successful paths to the end point from the current point
	 * @param {string} cave current cave
	 * @param {string[]} visited all caves that have already been visited
	 * @returns {string[]} list of completed paths
	 */
	function findPathsToEnd(cave, visited) {
		if (cave === 'end') {
			return ['end'];
		} else {
			let nextSteps = connections[cave].filter((connection) => {
				const isBigCave = connection === connection.toUpperCase();
				const isUnvisited = !visited.includes(connection);
				return isBigCave || isUnvisited;
			});

			let viablePaths = [];
			for (let nextStep of nextSteps) {
				let nextStepPaths = findPathsToEnd(nextStep, [...visited, cave]);
				viablePaths.push(...nextStepPaths.map(path => `${cave}-${path}`));
			}

			return viablePaths;
		}
	}

	const completePaths = findPathsToEnd('start', []);
	console.log(completePaths.length);
})();

// Part 2
(function () {
	/**
	 * Determines whether any small cave has already been visited twice
	 * @param {string[]} visited list of all caves which have been visited so far
	 * @returns {boolean} whether any small cave has been visited twice
	 */
	function hasDoubledUpOnSmallCave(visited) {
		const visitedSmallCaves = visited.filter(cave => (cave === cave.toLowerCase()));
		const uniqueSmallCaves = Array.from(new Set(visitedSmallCaves));
		return visitedSmallCaves.length > uniqueSmallCaves.length;
	}

	/**
	 * Recursively determines successful paths to the end cave from the current point
	 * @param {string} cave current cave
	 * @param {string[]} visited all caves that have already been visited
	 * @returns {string[]} list of completed paths
	 */
	function findPathsToEnd(cave, visited) {
		if (cave === 'end') {
			return ['end'];
		}
		
		let nextSteps = connections[cave].filter((connection) => {
			if (connection === 'start') return false;

			// Big caves
			const isBigCave = connection === connection.toUpperCase();
			if (isBigCave) return true;

			// Small caves
			const hasVisitedSmallCave = visited.includes(connection);
			const hasDoubledUp = hasDoubledUpOnSmallCave([...visited, cave]);
			return !hasVisitedSmallCave || !hasDoubledUp;
		});

		let viablePaths = [];
		for (let nextStep of nextSteps) {
			let nextStepPaths = findPathsToEnd(nextStep, [...visited, cave]);
			viablePaths.push(...nextStepPaths.map(path => `${cave},${path}`));
		}

		return viablePaths;
	}

	const completePaths = findPathsToEnd('start', []);
	console.log(completePaths.length);
})();