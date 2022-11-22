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
	setUserDisplayName,
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
			displayName: "",
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

			if (
				data.displayName === undefined ||
				data.displayName === ""
			) {
				this.volatileData.displayName = "name not set";
			} else {
				this.volatileData.displayName =
					data.displayName;
			}

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

		document.getElementById("editNameButton").addEventListener(
			"click",
			this.showEditName
		);
		document.getElementById("cancelNameButton").addEventListener(
			"click",
			this.hideEditName
		);

		document.getElementById("saveNameButton").addEventListener(
			"click",
			() => {
				const newName =
					document.getElementById(
						"newNameInput"
					).value;

				if (newName === undefined || newName === "") {
					this.volatileData.displayName =
						"name not set";
				} else {
					this.volatileData.displayName = newName;
				}

				setUserDisplayName(newName);

				this.hideEditName();
			}
		);
	}

	hideEditName() {
		document.getElementById("name").classList.remove("hidden");
		document.getElementById("editName").classList.add("hidden");
	}

	showEditName() {
		document.getElementById("name").classList.add("hidden");
		document.getElementById("editName").classList.remove("hidden");
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
        <p id="name">Display name: <span>{{ displayName }}</span> <button id="editNameButton" type="button">Edit</button></p>
        <p id="editName" class="hidden">Display name: <input id="newNameInput" type="text" /> 
                <button id="saveNameButton" type="button">Save</button>
                <button id="cancelNameButton" type="button">Cancel</button>
        </p>
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

        .hidden {
                display: none;
        }
</style>
`;

export default ProfileScreen;
