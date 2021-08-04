var wordsDiv = document.getElementById("words");
const java = document.getElementById("java");
const c = document.getElementById("c");
const cpp = document.getElementById("cpp");
const csharp = document.getElementById("csharp");
const py = document.getElementById("py");
const go = document.getElementById("go");
const kotlin = document.getElementById("kotlin");
const js = document.getElementById("js");
const bash = document.getElementById("bash");
const lineLimitElement = document.getElementById("line_limit");
const timeLimitElement = document.getElementById("time_limit");
const fontChanger = document.getElementById("font");

lineLimitElement.addEventListener("input", (e) => {
	if (e.target.value == "") {
		lineLimitElement.style.width = 80 + "px";
	}
});

timeLimitElement.addEventListener("input", (e) => {
	if (e.target.value == "") {
		timeLimitElement.style.width = 80 + "px";
	}
});

var myCodeArr = [
	`if __name__ == "__main__":
    print("Hello, world!")
    print(" - Christoffer")`,
	`public static void main(String[] args) {
    String greeting = "Hello";
    System.out.println(greeting);
}`,
	`int main() {
    printf("Hello, World!");
    return 0;
}`,
	`int main() {
    std::cout << "Hello World!";
    return 0;
}`,
	`static void Main(string[] args) {
    System.Console.WriteLine("Hello World!");
}`,
	`func main() {
    fmt.Println("Hello, World!")
}`,
	`fun main() {
    println("Hello, World!")
}`,
	`function main() {
    console.log("Hello, World!");
};
main();`,
	`#!/bin/bash

hello_world () {
    echo 'Hello, World!'
}

hello_world`,
	`fn main() {
    println!("Hello World!");
}`,
];

var myCode = myCodeArr[0];
var codeDifficulty;
var lines = myCode.split("\n");
var allCharacters = [];
var characterProgress = 0;
var numCorrect = 0;
var numErrors = 0;
let erroredCharacters = [];
let correctCharacters = [];
let numCorrectLastSecond = 0;
let numCorrectListEverySecond = [];

var elapsedTime = 0;
var intervalId = undefined;
var isTimerRunning = false;
let previousSecond;
let elapsedTimeInSeconds;

function resetVariables() {
	myCode = myCodeArr[0];
	codeDifficulty = undefined;
	lines = myCode.split("\n");
	allCharacters = [];
	characterProgress = 0;
	numCorrect = 0;
	numErrors = 0;
	erroredCharacters = [];
	correctCharacters = [];
	numCorrectLastSecond = 0;
	numCorrectListEverySecond = [];

	elapsedTime = 0;
	intervalId = undefined;
	isTimerRunning = false;
	previousSecond = undefined;
	elapsedTimeInSeconds = undefined;
}
resetVariables();

document.getElementById("restartButton").addEventListener("click", function () {
	/*
		resetVariables();
		document.getElementById("selectDiv").classList.remove("displaynone");
		document.getElementById("writingDiv").classList.add("displaynone");
		document.getElementById("resultDiv").classList.add("displaynone");
	*/

	location.reload();
});

function callFunc() {
	generateCode();
	document.getElementById("selectDiv").classList.add("displaynone");
	document.getElementById("writingDiv").classList.remove("displaynone");
	document.getElementById("words").focus();
	return;
}
//adding language to results page directly once the button is clicked
java.addEventListener("click", () => {
	myCode = myCodeArr[1];
	document.getElementById("langDiv").innerHTML = "Java";
	callFunc();
});

c.addEventListener("click", () => {
	myCode = myCodeArr[2];
	document.getElementById("langDiv").innerHTML = "C";
	callFunc();
});

cpp.addEventListener("click", () => {
	myCode = myCodeArr[3];
	document.getElementById("langDiv").innerHTML = "C++";
	lang = "C";
	callFunc();
});

csharp.addEventListener("click", () => {
	myCode = myCodeArr[4];
	document.getElementById("langDiv").innerHTML = "C#";
	callFunc();
});

py.addEventListener("click", () => {
	myCode = myCodeArr[0];
	document.getElementById("langDiv").innerHTML = "Python";
	callFunc();
});

go.addEventListener("click", () => {
	myCode = myCodeArr[5];
	document.getElementById("langDiv").innerHTML = "Golang";
	callFunc();
});

kotlin.addEventListener("click", () => {
	myCode = myCodeArr[6];
	document.getElementById("langDiv").innerHTML = "Kotlin";
	callFunc();
});

js.addEventListener("click", () => {
	myCode = myCodeArr[7];
	document.getElementById("langDiv").innerHTML = "JS";
	callFunc();
});

bash.addEventListener("click", () => {
	myCode = myCodeArr[8];
	document.getElementById("langDiv").innerHTML = "Bash";
	callFunc();
});
rust.addEventListener("click", () => {
	myCode = myCodeArr[9];
	document.getElementById("langDiv").innerHTML = "Rust";
	callFunc();
});

function decodeHtml(html) {
	let txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

function changeFont(key) {
	if (key.key === "Enter") {
		const font = document.getElementById("font");

		if (font.value !== "") {
			const rootCss = document.querySelector(":root");
			rootCss.style.setProperty("--font-family", font.value);
		}
	}
}

function choose(choices) {
	var index = Math.floor(Math.random() * choices.length);
	return choices[index];
}

function generateCode() {
	var lines = myCode.split("\n");
	codeDifficulty = determineDifficulty(lines);
	allCharacters = [];

	line_limit = document.getElementById("line_limit").value;
	if (line_limit.length > 0) {
		line_limit = parseInt(line_limit);
		lines = lines.splice(0, line_limit);
		myCode = lines.join("\n");
	}

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];

		var lineDiv = document.createElement("div");

		for (var j = 0; j < line.length; j++) {
			const character = document.createElement("character");
			character.innerHTML = line[j];

			if (i > 0 && j == line.length - 1) {
				character.classList.add("last");
			}

			lineDiv.appendChild(character);
			allCharacters.push(character);
		}

		if (line.length > 0) wordsDiv.appendChild(lineDiv);
	}

	allCharacters[0].classList.add("active");
	allCharacters[allCharacters.length - 1].classList.add("finalElement");
}

function startTimer() {
	if (isTimerRunning) return;
	isTimerRunning = true;

	const timer = document.getElementById("timer");
	timer.classList.add("running");

	var time_limit = document.getElementById("time_limit").value;
	if (time_limit.length > 0) {
		time_limit = parseInt(time_limit);
	} else {
		time_limit = false;
	}

	var startTime = Date.now();

	intervalId = setInterval(function () {
		var newTime = Date.now();
		elapsedTime = Math.floor((newTime - startTime) / 1000);

		var minutes = Math.floor(elapsedTime / 60);
		var seconds = elapsedTime - minutes * 60;

		var minutesText = "";
		if (minutes < 10) minutesText = "0" + minutes;
		else minutesText += minutes;

		var secondsText = "";
		if (seconds < 10) secondsText = "0" + seconds;
		else secondsText += seconds;

		timer.innerHTML = minutesText + ":" + secondsText;

		if (elapsedTime == 3) {
			checkErrors(numErrors);
		}

		if (time_limit && elapsedTime >= time_limit) {
			writing_done();
		}
	}, 50);

	SecondsInterval = setInterval(function () {
		let newTime = Date.now();
		elapsedTimeInSeconds = Math.floor((newTime - startTime) / 1000);
		previousSecond = elapsedTimeInSeconds--;
		if (elapsedTimeInSeconds === 1) {
			numCorrectLastSecond = numCorrect;
			logWpmData(elapsedTimeInSeconds, numCorrectLastSecond);
		} else {
			logWpmData(elapsedTimeInSeconds, numCorrectLastSecond);
			numCorrectLastSecond = 0;
		}
	}, 1000);
}

function writing_done() {
	clearInterval(intervalId);
	clearInterval(SecondsInterval);
	document.getElementById("words").removeEventListener(
		"keydown",
		onKeyDown_handler
	);

	var averageWordLength = avgWordLength(myCode);

	var length = myCode.replaceAll("\n", "").length;
	var cpm = Math.round(60 * (numCorrect / elapsedTime));
	var wpm = Math.round(cpm / averageWordLength);
	var accuracy = Math.round((100 * numCorrect) / length);

	var rawCpm = Math.round((60 * (numCorrect + numErrors)) / elapsedTime);
	var rawWpm = Math.round(rawCpm / averageWordLength);

	document.getElementById("writingDiv").classList.add("displaynone");
	document.getElementById("resultDiv").classList.remove("displaynone");
	document.getElementById("resultDiv").classList.add("results");
	document.getElementById("cpmDiv").innerHTML = "" + cpm;
	document.getElementById("wpmDiv").innerHTML = "" + wpm;
	document.getElementById("rawWpmDiv").innerHTML = "" + rawWpm;
	document.getElementById("rawCpmDiv").innerHTML = "" + rawCpm;
	useGraphFunctions(wpm);
	document.getElementById("accuracy").innerHTML = "" + accuracy + "%";
	document.getElementById("difficulty").innerHTML = codeDifficulty;
	if (accuracy < 50) {
		document.getElementById("accuracy").style.color =
			"var(--error)";
	}
	var filtered = erroredCharacters.filter(function (value) {
		return value != "\t";
	});

	if (filtered.length == 0) {
		document.getElementById("error-container").style.display =
			"none";
		return;
	}
	let erroredCharacterList = "";
	erroredCharacters = new Set(erroredCharacters);
	const erroredCharactersHTML =
		document.getElementById("errored-characters");

	erroredCharacters.forEach((character) => {
		erroredCharacterList += "<li>" + character + "</li>";
	});
	erroredCharactersHTML.innerHTML = erroredCharacterList;
}
const lightThemeCheckBox = document.getElementById("light-checkbox");

function switchTheme(e) {
	if (e.target.checked) {
		document.documentElement.setAttribute("data-theme", "light");
	} else {
		document.documentElement.setAttribute("data-theme", "dark");
	}
}

lightThemeCheckBox.addEventListener("change", switchTheme, false);

function areEqual(arr1, arr2) {
	let n = arr1.length;
	let m = arr2.length;

	if (n != m) return false;

	arr1.sort();
	arr2.sort();

	for (let i = 0; i < n; i++) if (arr1[i] != arr2[i]) return false;

	return true;
}

function removeCharacterState(character, state) {
	character.classList.remove(state);
	character.scrollIntoView();
}

function addCharacterState(character, state) {
	character.classList.add(state);
	character.scrollIntoView();
}

function onKeyDown_handler(key) {
	if (key.ctrlKey) return;

	key.preventDefault();

	let registeredKey = key.key;

	decodedCharacter = decodeHtml(
		allCharacters[characterProgress].innerHTML
	);

	if (registeredKey != "Backspace" && characterProgress === 0) {
		startTimer();
	}

	if (key.key === "Tab" && decodedCharacter !== "\t") {
		registeredKey = "    ";
	}

	if (registeredKey == "Backspace") {
		if (characterProgress === 0) return false;
		allCharacters[characterProgress].classList.remove("active");
		characterProgress--;

		if (
			allCharacters[characterProgress].classList.contains(
				"correct"
			)
		) {
			numCorrect--;
			correctCharacters.push(
				allCharacters[characterProgress]
			);
		} else if (
			allCharacters[characterProgress].classList.contains(
				"spacerror"
			)
		) {
			removeCharacterState(
				allCharacters[characterProgress],
				"spacerror"
			);
			addCharacterState(
				allCharacters[characterProgress],
				"active"
			);
			numErrors--;
		} else {
			numErrors--;
		}

		allCharacters[characterProgress].classList.remove("correct");
		allCharacters[characterProgress].classList.remove("error");
		addCharacterState(allCharacters[characterProgress], "active");
	}

	if (registeredKey.length > 1 && registeredKey != "    ") return false;

	try {
		tabCharList = [
			allCharacters[characterProgress].innerHTML,
			allCharacters[characterProgress + 1].innerHTML,
			allCharacters[characterProgress + 2].innerHTML,
			allCharacters[characterProgress + 3].innerHTML,
		];
	} catch {}

	expectedTabCharList = [" ", " ", " ", " "];

	if (decodedCharacter === String(registeredKey)) {
		addCharacterState(allCharacters[characterProgress], "correct");
		numCorrect++;
		numCorrectLastSecond++;
	} else if (
		registeredKey === "    " &&
		areEqual(expectedTabCharList, tabCharList)
	) {
		allCharacters[characterProgress].classList.add("correct");
		allCharacters[characterProgress + 1].classList.add("correct");
		allCharacters[characterProgress + 2].classList.add("correct");
		allCharacters[characterProgress + 3].classList.add("correct");
		allCharacters[characterProgress].classList.remove("active");
		addCharacterState(
			allCharacters[characterProgress + 4],
			"active"
		);
		characterProgress += 3;
		numCorrect += 3;
		numCorrectLastSecond += 4;
	} else {
		// Error Code
		if (
			allCharacters[characterProgress].innerHTML == " " &&
			registeredKey.includes(" ") == false
		) {
			allCharacters[characterProgress].classList.add(
				"spacerror"
			);
		} else {
			allCharacters[characterProgress].classList.add("error");
		}
		allCharacters[characterProgress].classList.add("error");
		numErrors++;
		erroredCharacters.push(decodedCharacter);
	}

	allCharacters[characterProgress].classList.remove("active");

	if (
		allCharacters[characterProgress].classList.contains(
			"finalElement"
		)
	) {
		writing_done();
		return false;
	}

	if (allCharacters[characterProgress].classList.contains("last")) {
		var line = wordsDiv.childNodes[0];
		for (let i = 0; i < line.childNodes.length; i++) {
			var j = allCharacters.indexOf(line.childNodes[i]);
			allCharacters.splice(j, 1);
		}

		wordsDiv.removeChild(wordsDiv.childNodes[0]);
		characterProgress = wordsDiv.childNodes[0].childNodes.length;
		allCharacters[characterProgress].classList.add("active");
		return false;
	}

	characterProgress++;
	addCharacterState(allCharacters[characterProgress], "active");
	return false;
}

document.getElementById("words").addEventListener("keydown", onKeyDown_handler);

document.getElementById("githubbutton").addEventListener("click", function () {
	var link = document.getElementById("githubinput").value;
	if (link.length === 0) {
		generateCode();
		document.getElementById("selectDiv").classList.add(
			"displaynone"
		);
		document.getElementById("writingDiv").classList.remove(
			"displaynone"
		);
		document.getElementById("words").focus();
		return;
	}

	// Convert normal links to raw
	if (link.includes("github.com/")) {
		//Splicing the string to get the Language
		lang = link.split("/").pop().split(".").pop();
		document.getElementById(
			"langDiv"
		).innerHTML = `<a href=${link} target="blank">GitHub ${
			lang.charAt(0).toUpperCase() + lang.slice(1)
		}</a>`;
		link = link
			.replace("github.com", "raw.githubusercontent.com")
			.replace("/blob", "");
	}

	fetch(link).then((response) => {
		response.text().then((data) => {
			myCode = data;
			generateCode();
			document.getElementById("selectDiv").classList.add(
				"displaynone"
			);
			document.getElementById("writingDiv").classList.remove(
				"displaynone"
			);
			document.getElementById("words").focus();
		});
	});
});
