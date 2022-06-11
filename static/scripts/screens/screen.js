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
	 */
	constructor(title, rootElement, html) {
		this.title = title;
		this.rootElement = rootElement;
		this.html = html;
	}

	/**
	 * This is called when the screen should update the root element such that the screen content is displayed.
	 * @param {object} payload - Data comming from the current screen state.
	 */
	enter(payload) {
		document.title = "codetyper - " + this.title;
		this.rootElement.innerHTML = this.html;
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
