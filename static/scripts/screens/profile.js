import Screen from "./screen.js";
import { getUser, signOut } from "../firebase/service.js";
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
			return;
		}

		document.getElementById("userEmail").innerHTML =
			getUser().email;
		document.getElementById("signOutButton").addEventListener(
			"click",
			() => this.doSignOut()
		);
	}

	doSignOut() {
		signOut();
		fireEvent(CHANGE_SCREEN, getScreenObject(LOGIN_SCREEN));
	}

	leave() {
		return {};
	}
}

const PROFILE_HTML = `
<div id="profile">
	<h1>Profile</h1>
	<p>Profile for: <span id="userEmail"></span></p>
	<button type="button" id="signOutButton">Sign out</button>
</div>

`;

export default ProfileScreen;
