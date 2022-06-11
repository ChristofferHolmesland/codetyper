/**
 * @module settings:initialize
 * @requires events:bus
 * @requires settings:types
 * @license GPL-3.0-only
 */

import { CheckboxSetting, IntegerSetting } from "./types.js";
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

export default {
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
