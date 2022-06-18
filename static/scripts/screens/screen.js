/**
 * @module screens:screen
 * @license GPL-3.0-only
 */

/**
 * Screen object that can be displayed to the user.
 * @class
 */
class Screen {
	/**
	 * Creates a new screen.
	 * @param {string} title - Title of the screen.
	 * @param {HTMLElement} rootElement - Root element that the screen belongs to.
	 * @param {string} html - HTML content that will be shown where the screen is displayed.
	 * @param {object} volatileData -
	 */
	constructor(title, rootElement, html, volatileData = {}) {
		this.title = title;
		this.rootElement = rootElement;
		this.html = html;

		this.connectedElements = {};

		const that = this;

		for (const key in volatileData) {
			if (!volatileData.hasOwnProperty(key)) continue;

			let value = volatileData[key];
			delete volatileData[key];

			this.connectedElements[key] = [];

			Object.defineProperty(volatileData, key, {
				get() {
					return value;
				},
				set(newValue) {
					value = newValue;

					const elements =
						that.connectedElements[key];
					for (
						let i = 0;
						i < elements.length;
						i++
					) {
						elements[i].innerHTML = value;
					}
				},
			});
		}

		this.volatileData = volatileData;
	}

	/**
	 * This is called when the screen should update the root element such that the screen content is displayed.
	 * @param {object} payload - Data comming from the current screen state.
	 */
	enter(payload) {
		document.title = "codetyper - " + this.title;
		this.rootElement.innerHTML = this.html;
		this.generateConnectedElements();
	}

	/**
	 * Reads the HTML and finds instances where the text of an element is bound to volatile data.
	 * The bound elements are stored in a list so that the text can be updated when the data changes.
	 */
	generateConnectedElements() {
		for (const key in this.connectedElements) {
			this.connectedElements[key].length = 0;
		}

		const elements = [this.rootElement];
		while (elements.length > 0) {
			const element = elements.shift();
			elements.push(...element.children);

			if (element.children.length !== 0) continue;

			let text = element.innerText;
			if (!text.startsWith("{{") && !text.endsWith("}}"))
				continue;

			text = text
				.replaceAll("{{", "")
				.replaceAll("}}", "")
				.replaceAll(" ", "");
			if (this.connectedElements[text] === undefined) {
				throw (
					"Found element binding which does not exist in volatile data, key: " +
					text
				);
			}

			element.innerText = this.volatileData[text];
			this.connectedElements[text].push(element);
		}
	}

	/**
	 * If the screen needs to transfer data to the next screen that can be returned here.
	 * @returns {object} data that should be available to the next screen.
	 */
	leave() {
		return {};
	}
}

export default Screen;
