const CHANGE_SCREEN = "changeScreen";
const GITHUB_LIMIT_WARNING = "githubLimitWarning";

const SUBSCRIBERS = {};
SUBSCRIBERS[CHANGE_SCREEN] = [];

function addSubscriber(event, handler) {
	if (SUBSCRIBERS[event] !== undefined) {
		SUBSCRIBERS[event].push(handler);
		return true;
	}

	return false;
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

		return true;
	}

	return false;
}

export {
	CHANGE_SCREEN,
	GITHUB_LIMIT_WARNING,
	addSubscriber,
	removeSubscriber,
	fireEvent,
};
