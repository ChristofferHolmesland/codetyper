import { CheckboxSetting } from "./types.js";
import { addSubscriber, SETTINGS_CHANGED } from "../events/bus.js";

addSubscriber(SETTINGS_CHANGED, function (payload) {
	const name = payload.name;
	const value = payload.value;

	window.localStorage.setItem(name, value);
});

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
