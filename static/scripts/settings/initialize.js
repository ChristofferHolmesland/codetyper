/**
 * @module settings:initialize
 * @requires events:bus
 * @requires settings:types
 * @license GPL-3.0-only
 */

import { CheckboxSetting, ColorSetting, IntegerSetting } from "./types.js";
import { addSubscriber, SETTINGS_CHANGED } from "../events/bus.js";

/**
 * Adds an event handler to the SETTINGS_CHANGED event that saves the new values to local storage.
 */
addSubscriber(SETTINGS_CHANGED, function (payload) {
	const name = payload.name;
	const value = payload.value;

	window.localStorage.setItem(name, value);
});

/**
 * Loads a boolean setting from local storage.
 * @param {string} name - Name of the setting.
 * @param {boolean} nullValue - Value to return if the setting is not found. Default: false.
 * @returns {boolean} The setting value.
 */
function loadBooleanValue(name, nullValue = false) {
	let value = window.localStorage.getItem(name);

	if (value === null) {
		value = nullValue;
	} else {
		value = value === "true";
	}

	return value;
}

/**
 * Loads an integer setting from local storage.
 * @param {string} name - Name of the setting
 * @param {integer} nullValue - Value to return if the setting is not found. Default: 1.
 * @returns {integer} The setting value.
 */
function loadIntegerValue(name, nullValue = 1) {
	let value = window.localStorage.getItem(name);

	if (value === null) {
		value = nullValue;
	} else {
		value = parseInt(value);
	}

	return value;
}

/**
 * Loads a string setting from local storage.
 * @param {string} name - Name of the setting
 * @param {string} nullValue - Value to return if the setting is not found. Default: "".
 * @returns {string} The setting value.
 */
function loadStringValue(name, nullValue = "") {
	let value = window.localStorage.getItem(name);

	if (value === null) {
		value = nullValue;
	}

	return value;
}

const SETTINGS = {
	codeWrapping: new CheckboxSetting(
		"codeWrapping",
		"Split long lines into multiple lines?",
		loadBooleanValue("codeWrapping")
	),
	codeWrappingCharacters: new IntegerSetting(
		"codeWrappingCharacters",
		"Number of characters to show when line wrapping is disabled",
		loadIntegerValue("codeWrappingCharacters", 5),
		1,
		35
	),
	visualiseWhitespace: new CheckboxSetting(
		"visualiseWhitespace",
		"Visualise whitespace by showing a dot in the code?",
		loadBooleanValue("visualiseWhitespace")
	),
};

const colors = [
	["--main-bg", "Main background", "#2e3440"],
	["--main-fg", "Main foreground", "#eceff4"],
	["--sub-fg", "Sub foreground", "#617b94"],
	["--input-bg", "Input background", "#eceff4"],
	["--second-bg", "Secondary background", "#3b4252"],
	["--timer-fg", "Timer foreground", "#d8dee9"],
	["--timer-running", "Timer running", "#81a1c1"],
	["--select-div-fg", "Selected div foreground", "#eceff4"],
	["--error", "Error", "#bf616a"],
	["--result-fg", "Result foreground", "#eceff4"],
	["--character", "Character", "#d8dee9"],
	["--placeholder", "Placeholder", "#757575"],
	["--correct", "Correct", "#a3be8c"],
	["--dash", "Dash", "#ebcb8b"],
	["--button-bg", "Button background", "#81a1c1"],
	["--button-fg", "Button foreground", "#2e3440"],
	["--button-hover-bg", "Button hover background", "#88c0d0"],
	["--lang-button-hover", "Language button hover", "#a3be8c"],
	["--lang-button", "Language button", "#81a1c1"],
	["--warning-text", "Warning text", "#fffc00"],
];

for (let i = 0; i < colors.length; i++) {
	const c = colors[i];

	SETTINGS[c[0]] = new ColorSetting(
		c[0],
		c[1],
		loadStringValue(c[0], c[2]),
		c[2],
		"Theme::Colors"
	);
}

export default SETTINGS;
