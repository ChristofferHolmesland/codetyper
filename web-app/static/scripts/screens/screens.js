/**
 * @module screens:screens
 * @requires screens:PickScreen
 * @requires screens:TestScreen
 * @requires screens:ResultScreen
 * @requires screens:ProfileScreen
 * @requires screens:AuthScreen
 * @requires screens:SettingsScreen
 * @license GPL-3.0-only
 */

import PickScreen from "./pick.js";
import TestScreen from "./test.js";
import ResultScreen from "./result.js";
import ProfileScreen from "./profile.js";
import AuthScreen from "./auth.js";
import SettingsScreen from "./settings.js";
import TestLobbyScreen from "./testLobby.js";

const ROOT_ELEMENT = document.getElementById("screenContainer");

const PICK_SCREEN = "PICK_SCREEN";
const TEST_SCREEN = "TEST_SCREEN";
const RESULT_SCREEN = "RESULT_SCREEN";
const PROFILE_SCREEN = "PROFILE_SCREEN";
const AUTH_SCREEN = "AUTH_SCREEN";
const SETTINGS_SCREEN = "SETTINGS_SCREEN";
const TEST_LOBBY_SCREEN = "TEST_LOBBY_SCREEN";

/**
 * Array with every screen that is in the application. New screens must be added to this array to be included.
 * @const
 * @type {array<string>}
 */
const ALL_SCREENS = [
	PICK_SCREEN,
	TEST_SCREEN,
	RESULT_SCREEN,
	PROFILE_SCREEN,
	AUTH_SCREEN,
	SETTINGS_SCREEN,
	TEST_LOBBY_SCREEN,
];

const SCREENS = {};

/**
 * Returns the screen object for the given name.
 * @param {string} name - Name of the scren
 * @returns {Screen} Screen object
 * @throws Will throw an error if name is not a valid screen.
 */
function getScreenObject(name) {
	if (!ALL_SCREENS.includes(name)) {
		throw "Attempted to get screen that does not exist: " + name;
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
	} else if (name === PROFILE_SCREEN) {
		SCREENS[name] = new ProfileScreen(ROOT_ELEMENT);
	} else if (name === AUTH_SCREEN) {
		SCREENS[name] = new AuthScreen(ROOT_ELEMENT);
	} else if (name === SETTINGS_SCREEN) {
		SCREENS[name] = new SettingsScreen(ROOT_ELEMENT);
	} else if (name === TEST_LOBBY_SCREEN) {
		SCREENS[name] = new TestLobbyScreen(ROOT_ELEMENT);
	}

	return SCREENS[name];
}

export {
	PICK_SCREEN,
	TEST_SCREEN,
	RESULT_SCREEN,
	PROFILE_SCREEN,
	AUTH_SCREEN,
	SETTINGS_SCREEN,
	TEST_LOBBY_SCREEN,
	getScreenObject,
};
