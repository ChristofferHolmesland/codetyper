/* WHAT I AM SUPPOSED TO DO */

//- Speed information
//  - Text
//    - Words per minute (WPM)
//    - Characters per minute (CPM)
//    - Time spent
//  - Graph
//    - WPM after X seconds
//    - WPM after X characters
//    - WPM after X words
//    - WPM after X lines
//- Accuracy
//  - Text
//    - Accuracy %
//    - Number of correct/wrong characters
//    - Number of correct/wrong words
//  - Graph
//    - Mark errors on the graphs with speed information. E.g, if there was an error at 3 seconds then there should be a red cross there.
//  - Other
//    - Some way to see the most frequent characters that have errors. List, pie chart, ...?
//- Other
//  - Difficulty rating (text or percentage?)
//  - Button to share the result as an image
//  - Button to go back to the start to pick a different test
//  - Button to restart the test
//  - Button to start a new random test
//

// average word length functions for finding WPM
function removeAllValues(value, arr) {
	let outArr = [];
	arr.forEach((i) => {
		if (i !== value) {
			outArr.push(i);
		}
	});
	return outArr;
}

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

// see if any character has been errored
var errored = false;
function checkErrors(numErrors) {
	if (numErrors) {
		errored = true;
	}
	console.log(errored);
}

let wpmData = { labels: [], data: [] };
function logWpmData(time, numCorrectLastSecond) {
	wpmData.labels.push(time);
	wpmData.data.push(numCorrectLastSecond);
	console.log(wpmData);
}

function genGraphData(wpmData, avgWordLength) {}

function drawGraph(data) {
	const graphConfig = {
		type: "line",
		data: data,
	};
}

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
