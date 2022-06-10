const CHANGE_SCREEN = "changeScreen";
const GITHUB_LIMIT_WARNING = "githubLimitWarning";
const SETTINGS_CHANGED = "settingsChanged";

const SUBSCRIBERS = {};
SUBSCRIBERS[CHANGE_SCREEN] = [];
SUBSCRIBERS[GITHUB_LIMIT_WARNING] = [];
SUBSCRIBERS[SETTINGS_CHANGED] = [];

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
