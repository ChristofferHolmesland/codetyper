import Screen from "./screen.js";
import { getUser } from "../firebase/service.js";
import { getScreenObject, LOGIN_SCREEN } from "./screens.js";
import { fireEvent, CHANGE_SCREEN } from "../events/bus.js";

class ProfileScreen extends Screen {
	constructor(element) {
		super("Profile", element, PROFILE_HTML);
	}

	enter(payload) {
		super.enter(payload);

		if (getUser() === undefined) {
			fireEvent(CHANGE_SCREEN, getScreenObject(LOGIN_SCREEN));
		}
	}

	leave() {
		return {};
	}
}

const PROFILE_HTML = `
<p>Profile</p>
`;

export default ProfileScreen;
