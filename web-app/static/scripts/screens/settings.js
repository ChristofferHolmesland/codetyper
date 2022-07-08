/**
 * @module screens:settingsscreen
 * @requires settings:initialize
 * @license GPL-3.0-only
 */

import Screen from "./screen.js";
import Settings from "../settings/initialize.js";

/**
 * SettingsScreen lets the user edit their settings.
 * @class
 */
class SettingsScreen extends Screen {
	constructor(element) {
		super("Settings", element, SETTINGS_HTML);
	}

	enter(payload) {
		super.enter(payload);

		const groups = {};

		for (const key in Settings) {
			if (Settings.hasOwnProperty(key)) {
				const elements =
					Settings[key].getHTMLElements();
				const div = document.createElement("div");

				div.appendChild(elements.label);
				div.appendChild(elements.input);

				div.classList.add("settings-row");

				if (
					groups[Settings[key].settingsGroup] ===
					undefined
				) {
					groups[Settings[key].settingsGroup] =
						[];
				}

				groups[Settings[key].settingsGroup].push(div);
			}
		}

		for (const group in groups) {
			const div = document.createElement("div");

			const h2 = document.createElement("h2");
			h2.textContent = group;

			div.appendChild(h2);

			for (let i = 0; i < groups[group].length; i++) {
				div.appendChild(groups[group][i]);
			}

			div.classList.add("settings-group");

			document.getElementById("settings-list").appendChild(
				div
			);
		}
	}

	leave() {
		return {};
	}
}

const SETTINGS_HTML = `
<div id="settings">
	<h1>Settings</h1>
	<div id="settings-list" class="settings-group">

	</div>
</div>

<style>
	#settings {
		width: 50%;
		margin: 0 auto;
		font-size: 1.5rem;
	}

	.settings-group {
		display: flex;
		flex-direction: column;
	}

	#settings h1 {
		font-size: 4rem;
	}

	#settings h2 {
		font-size: 2.5rem;
	}

	.settings-row {
		display: flex;
		justify-content: space-between;
	}

	.settings-row input {
		width: 25px;
		height: 25px;
	}

	.settings-row label {
		display: flex;
		align-items: center;
	}

	.settings-row input[type=number] {
		width: 50px;
	}

	.settings-row input[type=color] {
		width: 50px;
	}
	
	.settings-row > span > div {
		display: inline-block;
		height: 25px;
		cursor: pointer;
		margin-left: 15px;
		font-size: 1rem;
		text-decoration: underline;
	}
</style>
`;

export default SettingsScreen;
