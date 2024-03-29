/**
 * @module screens:testscreen
 * @requires screens:screens
 * @requires screens:screen
 * @requires utils:code
 * @requires events:bus
 * @license GPL-3.0-only
 */

import Screen from "./screen.js";
import {
	getScreenObject,
	MULTIPLAYER_RESULT_SCREEN,
	RESULT_SCREEN,
} from "./screens.js";
import { fireEvent, CHANGE_SCREEN, TEST_COMPLETED } from "../events/bus.js";
import {
	ENTER_CHARACTER,
	determineDifficulty,
	avgWordLength,
	decodeHtml,
} from "../utils/code.js";
import Settings from "../settings/initialize.js";

/**
 * Container for test result.
 * @typedef {object} TestResult
 * @property {number} cpm - Correct characters per minute.
 * @property {number} wpm - Correct words per minute.
 * @property {number} length - Length of test as number of characters.
 * @property {number} rawCpm - Correct and incorrect characters per minute.
 * @property {number} rawWpm - Correct and incorrect words per minute.
 * @property {number} accuracy - Accuracy of typing as percentage [0, 100].
 * @property {string} source - Source of the code
 * @property {object} wpmData - Used to track wpm over time.
 * @property {string} language - Code language.
 * @property {string} codeDifficulty - Estimated code difficulty.
 * @property {number} averageWordLength - The average length of every word in the code.
 * @property {boolean} completedTest - true if the test was performed until the end of the code or until the time limit, false otherwise.
 */

/**
 * TestScreen is used to show a coding test to the user.
 * @class
 */
class TestScreen extends Screen {
	constructor(element) {
		super("Type!", element, TEST_SCREEN_HTML);
	}

	enter(payload) {
		super.enter(payload);

		if (payload.lobbyId !== undefined) {
			this.isMultiplayer = true;
		} else {
			this.isMultiplayer = false;
		}

		this.numCorrect = 0;
		this.numErrors = 0;
		this.characterProgress = 0;
		this.isTimerRunning = false;
		this.elapsedTime = 0;
		this.elapsedTimeInSeconds = 0;
		this.completedTest = false;

		this.wpmData = {
			labels: [],
			data: [],
		};

		this.code = payload.code;
		this.source = payload.source;
		this.language = payload.language;
		this.lineLimit = payload.lineLimit;
		this.timeLimit = payload.timeLimit;

		this.words = document.getElementById("words");
		this.words.focus();
		this.words.addEventListener("keydown", (key) =>
			this.onKeyDownHandler(key, this)
		);

		this.generateCode();
	}

	/**
	 * @returns {TestResult} Test result.
	 */
	leave() {
		const averageWordLength = avgWordLength(this.code);
		const length = this.code.replaceAll("\n", "").length;
		const cpm = Math.round(
			60 * (this.numCorrect / this.elapsedTime)
		);
		const wpm = Math.round(cpm / averageWordLength);
		const accuracy = Math.round(
			(100 * this.numCorrect) / (length + this.lines.length)
		);
		const rawCpm = Math.round(
			(60 * (this.numCorrect + this.numErrors)) /
				this.elapsedTime
		);
		const rawWpm = Math.round(rawCpm / averageWordLength);

		const payload = {
			cpm: cpm,
			wpm: wpm,
			length: length,
			rawCpm: rawCpm,
			rawWpm: rawWpm,
			accuracy: accuracy,
			source: this.source,
			wpmData: this.wpmData,
			language: this.language,
			codeDifficulty: this.codeDifficulty,
			averageWordLength: averageWordLength,
			completedTest: this.completedTest,
		};

		fireEvent(TEST_COMPLETED, payload);

		return payload;
	}

	writingDone() {
		clearInterval(this.intervalId);
		clearInterval(this.secondsIntervalId);
		this.words.removeEventListener(
			"keydown",
			this.onKeyDownHandler
		);

		this.completedTest = true;

		if (this.isMultiplayer) {
			fireEvent(
				CHANGE_SCREEN,
				getScreenObject(MULTIPLAYER_RESULT_SCREEN)
			);
		} else {
			fireEvent(
				CHANGE_SCREEN,
				getScreenObject(RESULT_SCREEN)
			);
		}
	}

	startTimer() {
		if (this.isTimerRunning) return;
		this.isTimerRunning = true;

		const timer = document.getElementById("timer");
		timer.classList.add("running");

		var startTime = Date.now();

		const that = this;

		this.intervalId = setInterval(function () {
			var newTime = Date.now();
			that.elapsedTime = Math.floor(
				(newTime - startTime) / 1000
			);

			var minutes = Math.floor(that.elapsedTime / 60);
			var seconds = that.elapsedTime - minutes * 60;

			var minutesText = "";
			if (minutes < 10) minutesText = "0" + minutes;
			else minutesText += minutes;

			var secondsText = "";
			if (seconds < 10) secondsText = "0" + seconds;
			else secondsText += seconds;

			timer.innerHTML = minutesText + ":" + secondsText;

			if (
				that.timeLimit &&
				that.elapsedTime >= that.timeLimit
			) {
				that.writingDone();
			}
		}, 50);

		this.secondsIntervalId = setInterval(function () {
			let newTime = Date.now();
			that.elapsedTimeInSeconds = Math.floor(
				(newTime - startTime) / 1000
			);

			that.wpmData.labels.push(that.elapsedTimeInSeconds);
			that.wpmData.data.push(that.numCorrectLastSecond);

			if (that.elapsedTimeInSeconds === 1) {
				that.numCorrectLastSecond = that.numCorrect;
			} else {
				that.numCorrectLastSecond = 0;
			}
		}, 1000);
	}

	onKeyDownHandler(key, that) {
		if (key.ctrlKey) {
			return this.handleCtrlKey(key);
		}

		key.preventDefault();

		let registeredKey = key.key;

		if (
			this.allCharacters[this.characterProgress].innerHTML ===
			ENTER_CHARACTER
		) {
			if (registeredKey === "Enter") {
				registeredKey = ENTER_CHARACTER;
			} else if (registeredKey !== "Backspace") {
				return false;
			}
		}

		let decodedCharacter = decodeHtml(
			this.allCharacters[this.characterProgress].innerHTML
		);

		if (
			registeredKey != "Backspace" &&
			this.characterProgress === 0
		) {
			this.startTimer();
		}

		if (registeredKey === "Tab" && decodedCharacter !== "\t") {
			decodedCharacter = "    "; // when decodedCharacter is equal to " ",it prevents the tab from being registered to solve this we convert decodedCharacter to "   "
		}

		if (
			registeredKey === "Backspace" &&
			this.handleBackspaceKey()
		) {
			return false;
		}

		if (
			registeredKey.length > 1 &&
			registeredKey != "    " &&
			registeredKey != "Tab"
		) {
			// When someone presses a key that isn't a character like "Escape" or "Insert", that is detected here and the key is ignored.

			return false;
		}

		if (decodedCharacter === String(registeredKey)) {
			this.addCharacterState(
				this.allCharacters[this.characterProgress],
				"correct"
			);
			this.numCorrect++;
			this.numCorrectLastSecond++;
		} else if (
			(registeredKey == " " || registeredKey === "    ") &&
			decodedCharacter === "	"
		) {
			this.allCharacters[
				this.characterProgress
			].classList.add("correct");

			this.allCharacters[
				this.characterProgress
			].classList.remove("active");

			this.addCharacterState(
				this.allCharacters[this.characterProgress + 1],
				"active"
			);

			this.numCorrect += 1;
			this.numCorrectLastSecond += 1;
		} else {
			if (
				this.allCharacters[this.characterProgress]
					.innerHTML == " " &&
				registeredKey.includes(" ") == false
			) {
				this.allCharacters[
					this.characterProgress
				].classList.add("spacerror");
			} else {
				this.allCharacters[
					this.characterProgress
				].classList.add("error");
			}

			this.allCharacters[
				this.characterProgress
			].classList.add("error");
			this.numErrors++;
		}

		this.allCharacters[this.characterProgress].classList.remove(
			"active"
		);

		if (
			this.allCharacters[
				this.characterProgress
			].classList.contains("finalElement")
		) {
			this.writingDone();
			return false;
		}

		if (
			this.allCharacters[
				this.characterProgress
			].classList.contains("last")
		) {
			var line = this.words.childNodes[0];
			for (let i = 0; i < line.childNodes.length; i++) {
				var j = this.allCharacters.indexOf(
					line.childNodes[i]
				);
				this.allCharacters.splice(j, 1);
			}

			this.words.removeChild(this.words.childNodes[0]);
			this.characterProgress =
				this.words.childNodes[0].childNodes.length;
			this.allCharacters[
				this.characterProgress
			].classList.add("active");
			return false;
		}

		this.characterProgress++;
		this.addCharacterState(
			this.allCharacters[this.characterProgress],
			"active"
		);

		if (!Settings.codeWrapping.getValue()) {
			this.scrollCharactersIntoView();
		}

		return false;
	}

	/**
	 * Updates the characters that are shown on the current line so that more of them are visible to the user.
	 */
	scrollCharactersIntoView() {
		let element = this.allCharacters[this.characterProgress];
		for (
			let i = 0;
			i < Settings.codeWrappingCharacters.getValue();
			i++
		) {
			if (element.nextSibling === null) break;
			element = element.nextSibling;
		}

		element.scrollIntoView();
	}

	handleBackspaceKey() {
		if (this.characterProgress === 0) return true;
		if (
			this.allCharacters[
				this.characterProgress
			].classList.contains("first")
		)
			return true;

		this.allCharacters[this.characterProgress].classList.remove(
			"active"
		);
		this.characterProgress--;

		if (
			this.allCharacters[
				this.characterProgress
			].classList.contains("correct")
		) {
			this.numCorrect--;
		} else if (
			this.allCharacters[
				this.characterProgress
			].classList.contains("spacerror")
		) {
			this.removeCharacterState(
				this.allCharacters[this.characterProgress],
				"spacerror"
			);
			this.addCharacterState(
				this.allCharacters[this.characterProgress],
				"active"
			);
			this.numErrors--;
		} else {
			this.numErrors--;
		}

		this.allCharacters[this.characterProgress].classList.remove(
			"correct"
		);
		this.allCharacters[this.characterProgress].classList.remove(
			"error"
		);
		this.addCharacterState(
			this.allCharacters[this.characterProgress],
			"active"
		);
	}

	handleCtrlKey(key) {
		if (key.key === "Backspace") {
			key.preventDefault();

			while (this.characterProgress > 0) {
				this.allCharacters[
					this.characterProgress
				].classList.remove("active");
				this.characterProgress--;

				// Stop when we hit a space
				if (
					this.allCharacters[
						this.characterProgress
					].innerHTML === " "
				) {
					this.characterProgress++;
					break;
				}

				if (
					this.allCharacters[
						this.characterProgress
					].classList.contains("correct")
				) {
					this.numCorrect--;
				} else {
					this.numErrors--;
				}

				this.allCharacters[
					this.characterProgress
				].classList.remove("correct");
				this.allCharacters[
					this.characterProgress
				].classList.remove("spacerror");
				this.allCharacters[
					this.characterProgress
				].classList.remove("error");
			}

			this.allCharacters[
				this.characterProgress
			].classList.add("active");
		}

		return false;
	}

	generateCode() {
		this.lines = this.code.split("\n");
		this.codeDifficulty = determineDifficulty(this.lines);
		this.allCharacters = [];

		if (this.lineLimit !== -1) {
			this.lines = this.lines.splice(0, this.lineLimit);
			this.code = this.lines.join("\n");
		}

		for (let i = 0; i < this.lines.length; i++) {
			let line = this.lines[i];
			let lineDiv = document.createElement("div");

			for (let j = 0; j < line.length; j++) {
				const character =
					document.createElement("character");

				character.innerHTML = line[j];
				if (j === 0) {
					character.classList.add("first");
				}

				lineDiv.appendChild(character);
				this.allCharacters.push(character);
			}

			const character = document.createElement("character");
			character.innerHTML = ENTER_CHARACTER;

			if (i > 0) {
				character.classList.add("last");
			}

			if (line.length === 0) {
				character.classList.add("first");
			}

			lineDiv.appendChild(character);
			this.allCharacters.push(character);

			this.words.appendChild(lineDiv);
		}

		this.allCharacters[0].classList.add("active");
		this.allCharacters[this.allCharacters.length - 1].classList.add(
			"finalElement"
		);
	}

	removeCharacterState(character, state) {
		character.classList.remove(state);
		character.scrollIntoView();
	}

	addCharacterState(character, state) {
		character.classList.add(state);
		character.scrollIntoView();
	}
}

const TEST_SCREEN_HTML = `
<div id="writingDiv">
<div id="timer">00:00</div>
<div tabindex="0" id="words"></div>
</div>
`;

const EXPECTED_TAB_CHAR_LIST = [" ", " ", " ", " "];

export default TestScreen;
