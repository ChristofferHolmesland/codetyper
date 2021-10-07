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

function decodeHtml(html) {
	let txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

function isArrayEqual(a1, a2) {
	if (a1.length !== a2.length) return false;

	for (let i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) return false;
	}

	return true;
}