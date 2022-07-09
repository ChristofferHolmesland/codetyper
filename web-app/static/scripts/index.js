/**
 * @module index
 * @requires screens:screens
 * @requires events:bus
 * @license GPL-3.0-only
 */

import {
	PICK_SCREEN,
	PROFILE_SCREEN,
	SETTINGS_SCREEN,
	getScreenObject,
} from "./screens/screens.js";
import { CHANGE_SCREEN, addSubscriber } from "./events/bus.js";

/**
 * The current screen that is being shown to the user.
 * @type {object}
 */
let currentScreen = undefined;

let experimental = false;

/**
 * Changes which screen is being displayed to the user.
 * @param {Screen} newScreen - The new screen.
 */
function changeScreen(newScreen) {
	let payload = undefined;

	if (currentScreen !== undefined) {
		payload = currentScreen.leave();
	}

	currentScreen = newScreen;
	currentScreen.experimental = experimental;
	currentScreen.enter(payload);
}

document.getElementById("logoButton").addEventListener("click", function () {
	changeScreen(getScreenObject(PICK_SCREEN));
});

document.getElementById("profileButton").addEventListener("click", function () {
	changeScreen(getScreenObject(PROFILE_SCREEN));
});

document.getElementById("settingsButton").addEventListener(
	"click",
	function () {
		changeScreen(getScreenObject(SETTINGS_SCREEN));
	}
);

const urlParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlParams.entries());

if (params.experimental === "true") {
	experimental = true;
	const elements = document.getElementsByClassName("experimental");
	for (let i = 0; i < elements.length; i++) {
		elements[i].classList.remove("experimental");
	}
}

addSubscriber(CHANGE_SCREEN, changeScreen);

changeScreen(getScreenObject(PICK_SCREEN));
