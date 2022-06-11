/**
 * @module settings:types
 * @requires events:bus
 * @license GPL-3.0-only
 */

import { SETTINGS_CHANGED, fireEvent } from "../events/bus.js";

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

export { CheckboxSetting };
