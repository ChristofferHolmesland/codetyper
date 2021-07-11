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
