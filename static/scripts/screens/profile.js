/**
 * @module screens:ProfileScreen
 * @requires firebase:service
 * @requires screens:screens
 * @requires events:bus
 * @license GPL-3.0-only
 */

import Screen from "./screen.js";
import {
	getUser,
	signOut,
	getUserStats,
	getUserTests,
} from "../firebase/service.js";
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
			tests: [
				{
					wpm: 100,
					cpm: 50,
				},
				{
					wpm: 101,
					cpm: 51,
				},
			],
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

		getUserTests(5).then((data) => {
			const newData = [];

			for (let i = 0; i < data.size; i++) {
				const d = data.docs[i].data();
				d.timestamp = new Date(
					d.timestamp
				).toLocaleString();
				newData.push(d);
			}

			this.volatileData.tests = newData;
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
	<br />
	<h3>Last 5 tests</h3>
	<div id="tests" ct-iterate="tests">
		<div>
			<p>{{ timestamp }}</p>
			<p>Accuracy: <span>{{ accuracy }}</span>%</p>
			<p>WPM: <span>{{ wpm }}</span></p>
			<p>CPM: <span>{{ cpm }}</span></p>
		</div>
	</div>
	<br />
	<button type="button" id="signOutButton">Sign out</button>
</div>

<style>
	#tests {
		display: flex;
		flex-direction: column;
	}

	#tests div {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-between;
	}
</style>
`;

export default ProfileScreen;
