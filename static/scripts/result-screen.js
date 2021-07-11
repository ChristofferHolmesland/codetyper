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

function genGraphData() {}

function drawGraph(data) {
	const graphConfig = {
		type: "line",
		data: data,
	};
}
