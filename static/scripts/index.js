const ROOT_ELEMENT = document.getElementById("screenContainer");

const PICK_SCREEN = new PickScreen(ROOT_ELEMENT);
const TEST_SCREEN = new TestScreen(ROOT_ELEMENT);
const RESULT_SCREEN = new ResultScreen(ROOT_ELEMENT);

let currentScreen = undefined;

function changeScreen(newScreen) {
	let payload = undefined;

	if (currentScreen !== undefined) {
		payload = currentScreen.leave();
	}

	currentScreen = newScreen;
	currentScreen.enter(payload);
}

changeScreen(PICK_SCREEN);
