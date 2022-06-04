import { PICK_SCREEN, getScreenObject } from "./screens/screens.js";
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

addSubscriber(CHANGE_SCREEN, changeScreen);

changeScreen(getScreenObject(PICK_SCREEN));
