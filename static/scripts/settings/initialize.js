/**
 * @module settings:initialize
 * @requires events:bus
 * @requires settings:types
 * @license GPL-3.0-only
 */

import { CheckboxSetting } from "./types.js";
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

export default {
	codeWrapping: new CheckboxSetting(
		"codeWrapping",
		"Split long lines into multiple lines?",
		loadBooleanValue("codeWrapping")
	),
	visualiseWhitespace: new CheckboxSetting(
		"visualiseWhitespace",
		"Visualise whitespace by showing a dot in the code?",
		loadBooleanValue("visualiseWhitespace")
	),
};
