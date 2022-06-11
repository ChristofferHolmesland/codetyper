/**
 * @module utils:code
 * @license GPL-3.0-only
 */

/**
 * String representation of the enter character.
 * @const
 * @type {string}
 */
const ENTER_CHARACTER = "↩";

/**
 * Calculates the difficulty of typing code.
 * @param {...string} lines - The program code where each element in the array is one line.
 * @returns {string} The code difficulty: "Easy", "Medium", "Hard", "Impossible".
 */
function determineDifficulty(lines) {
	// When the code is longer the fingers get tired. Assume that maximum tiredness is achieved at 100 lines.
	var maxLength = 100;
	var lengthScore = Math.min(lines.length, 100) / maxLength;

	// Assumption: If the code contains many different characters then it is harder to type.
	var characters = {};
	for (var i = 0; i < lines.length; i++) {
		for (var j = 0; j < lines[i].length; j++) {
			characters[lines[i][j]] = 1;
		}
	}

	// 128 is the size of the simple ASCII table
	var characterScore = Object.keys(characters).length / 128;
	var finalScore = 0.6 * lengthScore + 0.4 * characterScore;

	if (finalScore <= 0.2) {
		return "Easy";
	} else if (finalScore <= 0.4) {
		return "Medium";
	} else if (finalScore <= 0.75) {
		return "Hard";
	} else {
		return "Impossible";
	}
}

/**
 * Calculates the average world length in the code.
 * @param {string} code - All of the code as one string.
 * @returns {number} The average length.
 */
function avgWordLength(code) {
	let desired = code.replace(/[^\w\s]/gi, " ");
	let code_lists = desired.split(" ");
	let wordAvg = 0;
	code_lists = removeAllValues("", code_lists);
	code_lists = removeAllValues("\n", code_lists);
	code_lists.forEach((word) => {
		wordAvg += word.length;
	});
	var wordLengthAvg = wordAvg / code_lists.length;
	return wordLengthAvg;
}

/**
 * Creates a copy of the array without any instance of value.
 * @param {*} value - Value to be removed
 * @param {array<*>} arr - Array to remove values from.
 * @returns {array<*>} A copy of the array without the value.
 */
function removeAllValues(value, arr) {
	let outArr = [];
	arr.forEach((i) => {
		if (i !== value) {
			outArr.push(i);
		}
	});

	return outArr;
}

/**
 * @todo Document this function
 */
function decodeHtml(html) {
	let txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

/**
 * Checks if two arrays contain the same elements and are the same length.
 * @param {array<*>} a1 
 * @param {array<*>} a2 
 * @returns {boolean} true if they are equal, false otherwise.
 */
function isArrayEqual(a1, a2) {
	if (a1.length !== a2.length) return false;

	for (let i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) return false;
	}

	return true;
}

export {
	ENTER_CHARACTER,
	determineDifficulty,
	avgWordLength,
	removeAllValues,
	decodeHtml,
	isArrayEqual,
};
