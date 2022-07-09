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
		this.volatileData = volatileData;
		this.experimental = false;

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
						if (
							elements[i].setter ===
							undefined
						) {
							elements[
								i
							].element.innerHTML = value;
						} else {
							elements[i].setter(
								newValue
							);
						}
					}
				},
			});

			if (Array.isArray(volatileData[key])) {
				this.setArrayWatchers(key);
			}
		}
	}

	/**
	 * This is called when the screen should update the root element such that the screen content is displayed.
	 * @param {object} payload - Data comming from the current screen state.
	 */
	enter(payload) {
		document.title = "codetyper - " + this.title;
		this.rootElement.innerHTML = this.html;
		this.generateConnectedElements();

		if (this.experimental === true) {
			const elements =
				document.getElementsByClassName("experimental");
			for (let i = 0; i < elements.length; i++) {
				elements[i].classList.remove("experimental");
			}
		}
	}

	/**
	 * Updates volatileData property when one of the array functions are used.
	 * @param {string} key - Name of volatileData property.
	 */
	setArrayWatchers(key) {
		const that = this;
		const arr = this.volatileData[key];

		const funcNames = [
			"fill",
			"pop",
			"push",
			"reverse",
			"shift",
			"sort",
			"splice",
			"unshift",
		];

		for (let i = 0; i < funcNames.length; i++) {
			arr[funcNames[i]] = function () {
				const ret = Array.prototype[funcNames[i]].apply(
					this,
					arguments
				);
				that.volatileData[key] = arr;
				return ret;
			};
		}
	}

	/**
	 * Tries to find a volatileData key binding inside the text of an element.
	 * @param {HTMLElement} element - Element to find key in.
	 * @returns {string|undefined} Returns the property name if it exists, undefined otherwise.
	 */
	getElementKey(element) {
		let text = element.innerText;
		if (!text.startsWith("{{") && !text.endsWith("}}"))
			return undefined;

		text = text
			.replaceAll("{{", "")
			.replaceAll("}}", "")
			.replaceAll(" ", "");

		return text;
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

			const iterateAttribute =
				element.getAttribute("ct-iterate");
			if (
				iterateAttribute !== null &&
				iterateAttribute !== ""
			) {
				this.handleIterateElement(
					element,
					iterateAttribute
				);
				continue;
			}

			elements.push(...element.children);

			if (element.children.length !== 0) continue;

			const text = this.getElementKey(element);
			if (text === undefined) continue;

			if (this.connectedElements[text] === undefined) {
				throw (
					"Found element binding which does not exist in volatile data, key: " +
					text
				);
			}

			element.innerText = this.volatileData[text];
			this.connectedElements[text].push({
				element: element,
			});
		}
	}

	/**
	 * Converts a HTML element to a container for a volatileData array.
	 * @param {HTMLElement} element - Iterate container.
	 * @param {string} context - Name of volatileData property to bind to.
	 */
	handleIterateElement(element, context) {
		if (this.connectedElements[context] === undefined) {
			throw (
				"Found iterate binding which does not exist in volatile data, key: " +
				context
			);
		}

		if (element.children.length !== 1) {
			console.error(element);
			throw "Found element with number of children !== 1";
		}

		const model = element.children[0];
		const dataContext = this.volatileData[context];

		this.setIterateElements(element, model, dataContext);

		this.connectedElements[context].push({
			setter: (newValue) => {
				this.setIterateElements(
					element,
					model,
					newValue
				);
			},
		});
	}

	/**
	 * Sets the content of a HTML element to the values in a volatileData array.
	 * @param {HTMLElement} container - Element that list elements should be added to.
	 * @param {HTMLElement} model - Element that represents one list item.
	 * @param {Array<object>} dataContext - Array of values that should be displayed in the list.
	 */
	setIterateElements(container, model, dataContext) {
		container.innerHTML = "";

		for (let i = 0; i < dataContext.length; i++) {
			const clone = model.cloneNode(true);

			const elements = [clone];
			while (elements.length > 0) {
				const cloneElement = elements.shift();
				elements.push(...cloneElement.children);

				const cloneElementId =
					cloneElement.getAttribute("id");
				const explicitId =
					cloneElement.getAttribute("explicitId");
				if (
					cloneElementId !== null &&
					cloneElementId !== "" &&
					(explicitId === null ||
						explicitId === "")
				) {
					throw (
						"Found cloned element with id that does not have the explicitId attribute, id: " +
						cloneElementId
					);
				}

				if (cloneElement.children.length !== 0)
					continue;

				const text = this.getElementKey(cloneElement);
				if (text === undefined) continue;

				cloneElement.innerText = dataContext[i][text];
			}

			container.appendChild(clone);
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
