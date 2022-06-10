import { SETTINGS_CHANGED, fireEvent } from "../events/bus.js";

class CheckboxSetting {
	name;
	description;
	settingsGroup;

	#value;
	#names;

	#element;
	#labelElement;
	#inputElement;

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

	getValue() {
		return this.#value;
	}

	getHTMLElements() {
		return this.#element;
	}
}

export { CheckboxSetting };
