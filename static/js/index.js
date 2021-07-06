var wordsDiv = document.getElementById("words");

var myCode = `if __name__ == "__main__":
    print("Hello, world!")
    print(" - Christoffer")`;

var lines = myCode.split("\n");
var allCharacters = [];
	
function generateCode() {
	lines = myCode.split("\n");
	allCharacters = [];

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
	allCharacters[allCharacters.length-1].classList.add("finalElement");
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
	
	var startTime = Date.now();
	
	intervalId = setInterval(function() {
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
	}, 100);
}

function writing_done() {
	clearInterval(intervalId);
	document.getElementById("words").removeEventListener("keydown", onKeyDown_handler);
	
	var length = myCode.replaceAll("\n", "").length;
	
	var cpm = Math.round(60 * (length / elapsedTime));
	var accuracy = Math.round(100 * numCorrect / length);
	
	document.getElementById("writingDiv").classList.add("displaynone");
	document.getElementById("resultDiv").classList.remove("displaynone");
	
	document.getElementById("cpmDiv").innerHTML = "" + cpm;
	document.getElementById("accuracy").innerHTML = "" + accuracy;
}

function onKeyDown_handler(key) {
	key.preventDefault();
	
	startTimer();

    while (lines[0] == true) {
        if (allCharacters[characterProgress].key == 8) return false;
    }
    if (key.key == 8) {
        if (characterProgress === 0) return false;

        allCharacters[characterProgress].classList.remove("active");
        characterProgress--;

        if (allCharacters[characterProgress].classList.contains("correct")) {
            numCorrect--;
        } else {
            numErrors-- && numerrorspace--;
        }

        allCharacters[characterProgress].classList.remove("correct");
        allCharacters[characterProgress].classList.remove("error");
        allCharacters[characterProgress].classList.remove("errorspace");
        allCharacters[characterProgress].classList.add("active");
    }

	if (key.key.length > 1) return false;
	
	if (allCharacters[characterProgress].innerHTML === key.key) {
		allCharacters[characterProgress].classList.add("correct");
		numCorrect++;
	} else {
		allCharacters[characterProgress].classList.add("error");
		numErrors++;
	}
	
	allCharacters[characterProgress].classList.remove("active")
	
	if (allCharacters[characterProgress].classList.contains("finalElement")) {
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
	allCharacters[characterProgress].classList.add("active")
	return false;
}

document.getElementById("words").addEventListener("keydown", onKeyDown_handler);

document.getElementById("githubbutton").addEventListener("click", function() {
	var link = document.getElementById("githubinput").value;
	if (link.length === 0) {
		generateCode();
		document.getElementById("selectDiv").classList.add("displaynone");
		document.getElementById("writingDiv").classList.remove("displaynone");
		return;
	}
	
	fetch(link).then((response) => {
		response.text().then((data) => {
			myCode = data;
			generateCode();
			document.getElementById("selectDiv").classList.add("displaynone");
			document.getElementById("writingDiv").classList.remove("displaynone");
		});
	});
});
