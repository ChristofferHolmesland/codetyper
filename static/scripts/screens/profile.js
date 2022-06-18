/**
 * @module screens:ProfileScreen
 * @requires firebase:service
 * @requires screens:screens
 * @requires events:bus
 * @license GPL-3.0-only
 */

import Screen from "./screen.js";
import { getUser, signOut, getUserStats } from "../firebase/service.js";
import { getScreenObject, AUTH_SCREEN, PICK_SCREEN } from "./screens.js";
import { fireEvent, CHANGE_SCREEN } from "../events/bus.js";

/**
 * ProfileScreen is used to show the user their profile.
 * @class
 */
class ProfileScreen extends Screen {
	constructor(element) {
		super("Profile", element, PROFILE_HTML, {
			userEmail: "",
			numberOfTests: 0,
		});
	}

	enter(payload) {
		if (getUser() === undefined) {
			fireEvent(CHANGE_SCREEN, getScreenObject(AUTH_SCREEN));
			return;
		}

		super.enter(payload);

		getUserStats().then((data) => {
			if (data === undefined) return;

			this.volatileData.numberOfTests = data.numberOfTests;
		});

		this.volatileData.userEmail = getUser().email;

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
	<p>Profile for: <span>{{ userEmail }}</span></p>
	<p>Number of tests: <span>{{ numberOfTests }}</span></p>
	<button type="button" id="signOutButton">Sign out</button>
</div>

`;

export default ProfileScreen;
