var wordsDiv = document.getElementById("words");
const java = document.getElementById("java");
const c = document.getElementById("c");
const cpp = document.getElementById("cpp");
const csharp = document.getElementById("csharp");
const py = document.getElementById("py");
const go = document.getElementById("go");
const kotlin = document.getElementById("kotlin");
const js = document.getElementById("js");

var myCodeArr = [`if __name__ == "__main__":
	print("Hello, world!")
	print(" - Christoffer")`, `public static void main(String[] args) {
	String greeting = "Hello";
	System.out.println(greeting);
}`, `int main() {
	printf("Hello, World!");
	return 0;
}`, `int main() {
	std::cout << "Hello World!";
	return 0;
}`, `static void Main(string[] args) {
	System.Console.WriteLine("Hello World!");
}`, `func main() {
	fmt.Println("Hello, Worl!")
}`, `fun main() {
	println("Hello, World!")
}`, `function main() {
	console.log("Hello, World!");
};
main();`];

function callFunc() {
	generateCode();
	document.getElementById("selectDiv").classList.add("displaynone");
	document.getElementById("writingDiv").classList.remove("displaynone");
	document.getElementById("words").focus();
	return;
}

var myCode;

java.addEventListener('click', () => {
	myCode = myCodeArr[1];
	callFunc()
})

c.addEventListener('click', () => {
	myCode = myCodeArr[2]
	callFunc()
})

cpp.addEventListener('click', () => {
	myCode = myCodeArr[3]
	callFunc()
})

csharp.addEventListener('click', () => {
	myCode = myCodeArr[4]
	callFunc()
})

py.addEventListener('click', () => {
	myCode = myCodeArr[0]
	callFunc()
})

go.addEventListener('click', () => {
	myCode = myCodeArr[5]
	callFunc()
})

kotlin.addEventListener('click', () => {
	myCode = myCodeArr[6]
	callFunc()
})

js.addEventListener('click', () => {
	myCode = myCodeArr[7]
	callFunc()
})
myCode = myCodeArr[0]
var lines = myCode.split("\n");
var allCharacters = [];

function decodeHtml(html) {
	let txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

function choose(choices) {
	var index = Math.floor(Math.random() * choices.length);
	return choices[index];
}

function generateCode() {
	var lines = myCode.split("\n");

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

var characterProgress = 0;
var numCorrect = 0;
var numErrors = 0;

var elapsedTime = 0;
var intervalId = undefined;
var isTimerRunning = false;
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

		if (time_limit && elapsedTime >= time_limit) {
			writing_done();
		}
	}, 100);
}

function writing_done() {
	clearInterval(intervalId);
	document.getElementById("words").removeEventListener(
		"keydown",
		onKeyDown_handler
	);

	var length = myCode.replaceAll("\n", "").length;
	var cpm = Math.round(60 * ((numCorrect + numErrors) / elapsedTime));
	var wpm = Math.round(cpm / 5);
	var accuracy = Math.round(100 * numCorrect / length);

	document.getElementById("writingDiv").classList.add("displaynone");
	document.getElementById("resultDiv").classList.remove("displaynone");

	document.getElementById("cpmDiv").innerHTML = "" + cpm;
	document.getElementById("wpmDiv").innerHTML = "" + wpm;
	document.getElementById("accuracy").innerHTML = "" + accuracy;
}

function onKeyDown_handler(key) {
	key.preventDefault();

	if (key.key != "Backspace" && characterProgress === 0) {
		startTimer();
	}

	if (key.key == "Backspace") {
		if (characterProgress === 0) return false;
		allCharacters[characterProgress].classList.remove("active");
		characterProgress--;

		if (
			allCharacters[characterProgress].classList.contains(
				"correct"
			)
		) {
			numCorrect--;
		} else {
			numErrors--;
		}

		allCharacters[characterProgress].classList.remove("correct");
		allCharacters[characterProgress].classList.remove("error");
		allCharacters[characterProgress].classList.add("active");
	}

	if (key.key.length > 1) return false;

	if (
		decodeHtml(allCharacters[characterProgress].innerHTML) ===
		String(key.key)
	) {
		allCharacters[characterProgress].classList.add("correct");
		numCorrect++;
	} else {
		// Error Code
		// if (allCharacters[characterProgress].innerHTML == " " && key.key != " ") {
		//	allCharacters[characterProgress].classList.add("spacerror")
		//	numErrors++;
		// } else {
		//	allCharacters[characterProgress].classList.add("error")
		// }
		allCharacters[characterProgress].classList.add("error")
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
	allCharacters[characterProgress].classList.add("active");
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

document.body.innerHTML.search('<').replaceAll('&lt;', '\<')

