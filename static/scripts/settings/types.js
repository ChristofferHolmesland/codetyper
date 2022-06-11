/**
 * @module settings:types
 * @requires events:bus
 * @license GPL-3.0-only
 */

import { SETTINGS_CHANGED, fireEvent } from "../events/bus.js";

/**
 * Regular expression that can test if a string is a {@link ColorString}
 * @const
 * @type {RegExp}
 */
const VALID_COLOR_STRING = /#[0-9A-Fa-f]{6}/;

/**
 * Container for the label and input elements.
 * @typedef {object} SettingElement
 * @property {HTMLElement} label - The label element.
 * @property {HTMLElement} input - The input element.
 */

/**
 * Creates a setting that can be changed with a checkbox.
 * @class
 */
class CheckboxSetting {
	/**
	 * Name of the setting.
	 * @type {string}
	 * @access public
	 */
	name;
	/**
	 * Text description of the setting.
	 * @type {string}
	 * @access public
	 */
	description;
	/**
	 * The group that the setting belongs to.
	 * @type {string}
	 * @access public
	 */
	settingsGroup;

	/**
	 * The current value of the setting.
	 * @type {*}
	 * @access private
	 */
	#value;
	/**
	 * The possible values that the setting can have.
	 * @type {array<*>}
	 * @access private
	 */
	#names;

	/**
	 * Object containing both the label and the input element.
	 * @type {SettingElement}
	 * @access private
	 */
	#element;
	/**
	 * Label element with the setting description.
	 * @type {HTMLElement}
	 * @access private
	 */
	#labelElement;
	/**
	 * Input element of type checkbox that can be used to change the value of the setting.
	 * @type {HTMLElement}
	 * @access private
	 */
	#inputElement;

	/**
	 * Creates a new setting.
	 * @param {string} name - Name of the setting.
	 * @param {string} description - Text description of the setting.
	 * @param {*} value - Current value of the setting. Default: false.
	 * @param {array<*>} names  - Array of length two that has the possible values of the setting. The first value is the unchecked value, the second value is the checked value. Default: [false, true].
	 * @param {string} settingsGroup - Name of the group this setting belongs to.
	 * @throws Error if value is not in names.
	 * @throws Error if names it not an array of length 2.
	 */
	constructor(
		name,
		description,
		value = false,
		names = [false, true],
		settingsGroup = "General"
	) {
		if (!names.includes(value)) {
			throw "Got value that is not in names: " + value;
		}

		if (!Array.isArray(names) || names.length !== 2) {
			throw (
				"Invalid value for names argument. Expected array of length two, but got: " +
				names
			);
		}

		this.name = name;
		this.description = description;
		this.settingsGroup = settingsGroup;

		this.#value = value;
		this.#names = names;

		this.#inputElement = document.createElement("input");
		this.#inputElement.setAttribute("type", "checkbox");
		this.#inputElement.setAttribute("id", "setting-" + this.name);
		this.#inputElement.setAttribute("name", this.name);
		/**
		 * @todo Make it possible to trigger boolean settings.
		 */
		this.#inputElement.setAttribute("disabled", true);

		if (this.#value === names[1]) {
			this.#inputElement.setAttribute("checked", "");
		}

		this.#inputElement.addEventListener("change", (e) => {
			if (e.target.checked) {
				this.#value = this.#names[1];
			} else {
				this.#value = this.#names[0];
			}

			fireEvent(SETTINGS_CHANGED, {
				name: this.name,
				value: this.#value,
			});
		});

		this.#labelElement = document.createElement("label");
		this.#labelElement.setAttribute("for", this.name);
		this.#labelElement.innerHTML = this.description;

		this.#element = {
			label: this.#labelElement,
			input: this.#inputElement,
		};
	}

	/**
	 * Gets the value of the setting.
	 * @returns {*} The current value.
	 */
	getValue() {
		return this.#value;
	}

	/**
	 *
	 * @returns {SettingElement} The input and label elements: {@link SettingElement}
	 */
	getHTMLElements() {
		return this.#element;
	}
}

/**
 * Creates an integer setting that can be changed by a number input box.
 * @class
 */
class IntegerSetting {
	/**
	 * Name of the setting.
	 * @type {string}
	 * @access public
	 */
	name;
	/**
	 * Text description of the setting.
	 * @type {string}
	 * @access public
	 */
	description;
	/**
	 * The group that the setting belongs to.
	 * @type {string}
	 * @access public
	 */
	settingsGroup;

	/**
	 * The current value of the setting.
	 * @type {integer}
	 * @access private
	 */
	#value;
	/**
	 * The minimum value that the setting can have.
	 * @type {integer}
	 * @access private
	 */
	#minimumValue;
	/**
	 * The maximum value that the setting can have.
	 * @type {integer}
	 * @access private
	 */
	#maximumValue;

	/**
	 * Object containing both the label and the input element.
	 * @type {SettingElement}
	 * @access private
	 */
	#element;
	/**
	 * Label element with the setting description.
	 * @type {HTMLElement}
	 * @access private
	 */
	#labelElement;
	/**
	 * Input element of type number that can be used to change the value of the setting.
	 * @type {HTMLElement}
	 * @access private
	 */
	#inputElement;

	/**
	 * Creates a new setting.
	 * @param {string} name - Name of the setting.
	 * @param {string} description - Text description of the setting.
	 * @param {integer} value - Current value of the setting. Default: 1.
	 * @param {integer} minimumValue - Minimum value for this setting. Default: 1.
	 * @param {integer} maximumValue - Maximum value for this setting. Default: 100.
	 * @param {string} settingsGroup - Name of the group this setting belongs to.
	 * @throws Error if value is outside the bounds defined by minimum and maximum.
	 * @throws Error if the minimum value is greater than the maximum value.
	 */
	constructor(
		name,
		description,
		value = 1,
		minimumValue = 1,
		maximumValue = 100,
		settingsGroup = "General"
	) {
		if (value < minimumValue || value > maximumValue) {
			throw "Got value that is outside the bounds: " + value;
		}

		if (minimumValue > maximumValue) {
			throw "Got minimum value that is greater than the maximum value";
		}

		this.name = name;
		this.description = description;
		this.settingsGroup = settingsGroup;

		this.#value = value;
		this.#minimumValue = minimumValue;
		this.#maximumValue = maximumValue;

		this.#inputElement = document.createElement("input");
		this.#inputElement.setAttribute("type", "number");
		this.#inputElement.setAttribute("id", "setting-" + this.name);
		this.#inputElement.setAttribute("name", this.name);
		this.#inputElement.setAttribute("min", this.#minimumValue);
		this.#inputElement.setAttribute("max", this.#maximumValue);
		this.#inputElement.setAttribute("step", 1);
		this.#inputElement.setAttribute("value", this.#value);

		this.#inputElement.addEventListener("change", (e) => {
			this.#value = parseInt(e.target.value);

			fireEvent(SETTINGS_CHANGED, {
				name: this.name,
				value: this.#value,
			});
		});

		this.#labelElement = document.createElement("label");
		this.#labelElement.setAttribute("for", this.name);
		this.#labelElement.innerHTML = this.description;

		this.#element = {
			label: this.#labelElement,
			input: this.#inputElement,
		};
	}

	/**
	 * Gets the value of the setting.
	 * @returns {integer} The current value.
	 */
	getValue() {
		return this.#value;
	}

	/**
	 *
	 * @returns {SettingElement} The input and label elements: {@link SettingElement}
	 */
	getHTMLElements() {
		return this.#element;
	}
}

/**
 * String representing a color with format: #RRGGBB
 * @typedef {string} ColorString
 */

/**
 * Creates an color setting that can be changed by a color input box.
 * @class
 */
class ColorSetting {
	/**
	 * Name of the setting.
	 * @type {string}
	 * @access public
	 */
	name;
	/**
	 * Text description of the setting.
	 * @type {string}
	 * @access public
	 */
	description;
	/**
	 * The group that the setting belongs to.
	 * @type {string}
	 * @access public
	 */
	settingsGroup;

	/**
	 * The current value of the setting.
	 * @type {ColorString} - See {@link ColorString}
	 * @access private
	 */
	#value;

	/**
	 * The default value of the setting.
	 * @type {ColorString} - See {@link ColorString}
	 * @access private
	 */
	#defaultValue;

	/**
	 * Object containing both the label and the input element.
	 * @type {SettingElement}
	 * @access private
	 */
	#element;
	/**
	 * Label element with the setting description.
	 * @type {HTMLElement}
	 * @access private
	 */
	#labelElement;
	/**
	 * Input element of type color that can be used to change the value of the setting.
	 * @type {HTMLElement}
	 * @access private
	 */
	#inputElement;

	/**
	 * Creates a new setting.
	 * @param {string} name - Name of the setting.
	 * @param {string} description - Text description of the setting.
	 * @param {ColorString} value - Current value of the setting. Default: #000000. See: {@link ColorString}.
	 * @param {ColorString} defaultValue - Default value of the setting. Default: #000000. See: {@link ColorString}.
	 * @param {string} settingsGroup - Name of the group this setting belongs to.
	 * @throws Error if value or default value does not have a valid format.
	 */
	constructor(
		name,
		description,
		value = "#000000",
		defaultValue = "#000000",
		settingsGroup = "General"
	) {
		if (
			!VALID_COLOR_STRING.test(value) ||
			!VALID_COLOR_STRING.test(defaultValue)
		) {
			throw (
				"Value or default value is not a ColorString, value: " +
				value +
				", default: " +
				defaultValue
			);
		}

		this.name = name;
		this.description = description;
		this.settingsGroup = settingsGroup;

		this.#value = value;
		this.#defaultValue = defaultValue;

		const colorInput = document.createElement("input");
		colorInput.setAttribute("type", "color");
		colorInput.setAttribute("id", "setting-" + this.name);
		colorInput.setAttribute("name", this.name);
		colorInput.setAttribute("value", this.#value);

		colorInput.addEventListener("input", (e) => {
			document.querySelector(":root").style.setProperty(
				this.name,
				e.target.value
			);
		});

		colorInput.addEventListener("change", (e) => {
			this.#value = e.target.value;

			fireEvent(SETTINGS_CHANGED, {
				name: this.name,
				value: this.#value,
			});
		});

		const resetElement = document.createElement("div");
		resetElement.innerHTML = "default";
		resetElement.addEventListener("click", () => {
			this.#value = this.#defaultValue;
			document.querySelector(":root").style.setProperty(
				this.name,
				this.#value
			);
			colorInput.value = this.#value;

			fireEvent(SETTINGS_CHANGED, {
				name: this.name,
				value: this.#value,
			});
		});

		this.#inputElement = document.createElement("span");
		this.#inputElement.appendChild(colorInput);
		this.#inputElement.appendChild(resetElement);

		this.#labelElement = document.createElement("label");
		this.#labelElement.setAttribute("for", this.name);
		this.#labelElement.innerHTML = this.description;

		this.#element = {
			label: this.#labelElement,
			input: this.#inputElement,
		};
	}

	/**
	 * Gets the value of the setting.
	 * @returns {ColorString} The current value.
	 */
	getValue() {
		return this.#value;
	}

	/**
	 *
	 * @returns {SettingElement} The input and label elements: {@link SettingElement}
	 */
	getHTMLElements() {
		return this.#element;
	}
}

export { CheckboxSetting, IntegerSetting, ColorSetting };
