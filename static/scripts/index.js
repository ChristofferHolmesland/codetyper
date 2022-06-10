import {
	PICK_SCREEN,
	PROFILE_SCREEN,
	SETTINGS_SCREEN,
	getScreenObject,
} from "./screens/screens.js";
import { CHANGE_SCREEN, addSubscriber } from "./events/bus.js";

let currentScreen = undefined;

function changeScreen(newScreen) {
	let payload = undefined;

	if (currentScreen !== undefined) {
		payload = currentScreen.leave();
	}

	currentScreen = newScreen;
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

addSubscriber(CHANGE_SCREEN, changeScreen);

changeScreen(getScreenObject(PICK_SCREEN));
