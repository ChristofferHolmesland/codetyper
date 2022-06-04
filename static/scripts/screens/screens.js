import PickScreen from "./pick.js";
import TestScreen from "./test.js";
import ResultScreen from "./result.js";

const ROOT_ELEMENT = document.getElementById("screenContainer");

const PICK_SCREEN = "PICK_SCREEN";
const TEST_SCREEN = "TEST_SCREEN";
const RESULT_SCREEN = "RESULT_SCREEN";

const ALL_SCREENS = [PICK_SCREEN, TEST_SCREEN, RESULT_SCREEN];

const SCREENS = {};

function getScreenObject(name) {
	if (!ALL_SCREENS.includes(name)) {
		return undefined;
	}

	if (SCREENS[name] !== undefined) {
		return SCREENS[name];
	}

	if (name === PICK_SCREEN) {
		SCREENS[name] = new PickScreen(ROOT_ELEMENT);
	} else if (name === TEST_SCREEN) {
		SCREENS[name] = new TestScreen(ROOT_ELEMENT);
	} else if (name === RESULT_SCREEN) {
		SCREENS[name] = new ResultScreen(ROOT_ELEMENT);
	}

	return SCREENS[name];
}

export { PICK_SCREEN, TEST_SCREEN, RESULT_SCREEN, getScreenObject };
