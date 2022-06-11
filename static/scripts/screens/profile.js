import Screen from "./screen.js";
import { getUser, signOut } from "../firebase/service.js";
import { getScreenObject, AUTH_SCREEN, PICK_SCREEN } from "./screens.js";
import { fireEvent, CHANGE_SCREEN } from "../events/bus.js";

class ProfileScreen extends Screen {
	constructor(element) {
		super("Profile", element, PROFILE_HTML);
	}

	enter(payload) {
		if (getUser() === undefined) {
			fireEvent(CHANGE_SCREEN, getScreenObject(AUTH_SCREEN));
			return;
		}

		super.enter(payload);

		document.getElementById("userEmail").innerHTML =
			getUser().email;
		document.getElementById("signOutButton").addEventListener(
			"click",
			() => this.doSignOut()
		);
	}

	doSignOut() {
		signOut();
		fireEvent(CHANGE_SCREEN, getScreenObject(PICK_SCREEN));
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
