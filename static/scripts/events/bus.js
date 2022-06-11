/**
 * @module events:bus
 * @license GPL-3.0-only
 */

/**
 * CHANGE_SCREEN is used to indicate that the application should change the displayed screen.
 * @const
 * @type {string}
 */
const CHANGE_SCREEN = "changeScreen";
/**
 * GITHUB_LIMIT_WARNING is used to indicate that the user is getting close to hitting the GitHub API limit.
 * @const
 * @type {string}
 */
const GITHUB_LIMIT_WARNING = "githubLimitWarning";
/**
 * SETTINGS_CHANGED is used to indicate that the user changed one of their settings.
 * @const
 * @type {string}
 */
const SETTINGS_CHANGED = "settingsChanged";

/**
 * SUBSCRIBERS is an object which maps event names to a lists of subscribers to the events. Every event has to be added to this object before it can be used.
 * @const
 * @type {object}
 */
const SUBSCRIBERS = {};
SUBSCRIBERS[CHANGE_SCREEN] = [];
SUBSCRIBERS[GITHUB_LIMIT_WARNING] = [];
SUBSCRIBERS[SETTINGS_CHANGED] = [];

/**
 * Adds a new subscriber to a specific function. When an event of type event is fired the handler function is called.
 * @param {string} event 
 * @param {function} handler 
 * @throws Will throw an error if event is not a valid event.
 */
function addSubscriber(event, handler) {
	if (SUBSCRIBERS[event] !== undefined) {
		SUBSCRIBERS[event].push(handler);
	} else {
		throw (
			"Tried adding handler to event that does not exist: " +
			event
		);
	}
}

/**
 * Removes a handler function from the event.
 * @param {string} event 
 * @param {function} handler 
 * @returns {boolean} true if the handler was removed, false if it did not exist.
 */
function removeSubscriber(event, handler) {
	if (
		SUBSCRIBERS[event] !== undefined &&
		SUBSCRIBERS[event].includes(handler)
	) {
		SUBSCRIBERS[event].splice(
			SUBSCRIBERS[event].indexOf(handler),
			1
		);
		return true;
	}

	return false;
}

/**
 * Triggers an event with the specified payload.
 * @param {string} event 
 * @param {object} payload 
 * @throws Will throw an error if event is not a valid event.
 */
function fireEvent(event, payload) {
	if (SUBSCRIBERS[event] !== undefined) {
		for (let i = 0; i < SUBSCRIBERS[event].length; i++) {
			SUBSCRIBERS[event][i](payload);
		}
	} else {
		throw "Fired event that does not exist: " + event;
	}
}

export {
	CHANGE_SCREEN,
	GITHUB_LIMIT_WARNING,
	SETTINGS_CHANGED,
	addSubscriber,
	removeSubscriber,
	fireEvent,
};
