// Parse puzzle input
const fs = require('fs');
const useTestInput = process.argv.includes('--test');
const inputPath = useTestInput ? `${__dirname}/.test` : `${__dirname}/.input`;
const lines = fs
	.readFileSync(inputPath, 'utf-8')
	.split('\n')
	.map(connection => connection.split('-'));

/** @type {Object<string, string[]>} */
const connections = {};
for (let line of lines) {
	const [start, end] = line;

	if (!connections[start]) {
		connections[start] = [];
	}
	connections[start].push(end);

	if (!connections[end]) {
		connections[end] = [];
	}
	connections[end].push(start);
}

console.log(connections);

// Part 1
(function () {
	/**
	 * 
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
	console.log(completePaths, completePaths.length);
})(); 