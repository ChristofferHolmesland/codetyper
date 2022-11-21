/**
 * @module screens:TestLobbyScreen
 * @requires screens:screens
 * @requires sockets:initialize
 * @license GPL-3.0-only
 */

import Screen from "./screen.js";
import {
	sendMessage,
	addHandler,
	removeHandler,
	CREATE_LOBBY,
	JOIN_LOBBY,
	DELETE_LOBBY,
	START_LOBBY,
	UPDATE_LOBBY,
} from "../sockets/initialize.js";
import { CHANGE_SCREEN, fireEvent } from "../events/bus.js";
import { getScreenObject, PICK_SCREEN, TEST_SCREEN } from "./screens.js";

/**
 * TestLobbyScreen is used to manage multiplayer games.
 * @class
 */
class TestLobbyScreen extends Screen {
	constructor(element) {
		super("Test Lobby", element, PROFILE_HTML, {
			lobbyId: "Creating lobby...",
			numberOfPlayers: 0,
			language: "",
			source: "",
			lineLimit: "",
			timeLimit: "",
			startCountdownStep: 3,
		});
	}

	enter(payload) {
		super.enter(payload);
		this.bindFunctions();

		this.hasClickedOnStart = false;
		this.isInLobby = false;
		this.isHost = false;
		this.testStarting = false;
		this.joiningGame = false;
		this.testPayload = undefined;

		this.setVolatileDataFromPayload(payload);

		addHandler(CREATE_LOBBY, this.onCreateLobby);
		addHandler(JOIN_LOBBY, this.onJoinLobby);
		addHandler(DELETE_LOBBY, this.onDeleteLobby);
		addHandler(START_LOBBY, this.onStartLobby);
		addHandler(UPDATE_LOBBY, this.onUpdateLobby);

		if (payload.lobbyId === undefined) {
			sendMessage(CREATE_LOBBY, payload);
		} else {
			this.volatileData.lobbyId = payload.lobbyId;
			sendMessage(JOIN_LOBBY, payload.lobbyId);
		}

		document.getElementById("copyId").addEventListener(
			"click",
			(event) => {
				navigator.clipboard.writeText(
					`${window.location.href}&lobbyId=${this.volatileData.lobbyId}`
				);
			}
		);
	}

	leave() {
		if (!this.testStarting && this.isInLobby) {
			sendMessage(DELETE_LOBBY, "");
		}

		removeHandler(CREATE_LOBBY, this.onCreateLobby);
		removeHandler(JOIN_LOBBY, this.onJoinLobby);
		removeHandler(DELETE_LOBBY, this.onDeleteLobby);
		removeHandler(START_LOBBY, this.onStartLobby);
		removeHandler(UPDATE_LOBBY, this.onUpdateLobby);

		if (this.joiningGame) {
			return this.testPayload;
		}

		return {};
	}

	onCreateLobby(socket, payload) {
		this.isInLobby = true;
		this.isHost = true;
		this.volatileData.lobbyId = payload;
		this.volatileData.numberOfPlayers = 1;

		const elements =
			document.getElementsByClassName("show-to-host");
		for (let i = 0; i < elements.length; i++) {
			elements[i].classList.remove("show-to-host");
		}

		document.getElementById("startTestButton").addEventListener(
			"click",
			() => {
				if (this.hasClickedOnStart) return;

				this.hasClickedOnStart = true;
				sendMessage(START_LOBBY, {});
			}
		);
	}

	onJoinLobby(socket, payload) {
		this.isInLobby = true;
		this.setVolatileDataFromPayload(payload);

		const elements =
			document.getElementsByClassName("show-to-player");
		for (let i = 0; i < elements.length; i++) {
			elements[i].classList.remove("show-to-player");
		}
	}

	setVolatileDataFromPayload(payload) {
		this.volatileData.numberOfPlayers = payload.numberOfPlayers;
		this.volatileData.language = payload.language;
		this.volatileData.source = payload.source;

		if (payload.timeLimit === false) {
			this.volatileData.timeLimit = "none";
		} else {
			this.volatileData.timeLimit = `${payload.timeLimit} second(s)`;
		}

		if (payload.lineLimit === -1) {
			this.volatileData.lineLimit = "none";
		} else {
			this.volatileData.lineLimit = `${payload.lineLimit} line(s)`;
		}
	}

	onDeleteLobby(socket, payload) {
		this.isInLobby = false;
		fireEvent(CHANGE_SCREEN, getScreenObject(PICK_SCREEN));
	}

	onStartLobby(socket, payload) {
		if (payload.status === "START_COUNTDOWN") {
			this.testStarting = true;

			document.getElementById("lobbyView").classList.add(
				"hidden"
			);
			document.getElementById(
				"countdownView"
			).classList.remove("hidden");
			const intervalId = setInterval(() => {
				if (
					this.volatileData.startCountdownStep ===
					0
				) {
					clearInterval(intervalId);
					return;
				}

				this.volatileData.startCountdownStep--;
			}, 1000);
		} else if (payload.status === "START_TEST") {
			this.joiningGame = true;
			this.testPayload = payload.testObject;
			fireEvent(CHANGE_SCREEN, getScreenObject(TEST_SCREEN));
		}
	}

	onUpdateLobby(socket, payload) {
		if (payload.numberOfPlayers !== undefined) {
			this.volatileData.numberOfPlayers =
				payload.numberOfPlayers;
		}
	}

	bindFunctions() {
		this.onCreateLobby = this.onCreateLobby.bind(this);
		this.onJoinLobby = this.onJoinLobby.bind(this);
		this.onDeleteLobby = this.onDeleteLobby.bind(this);
		this.onStartLobby = this.onStartLobby.bind(this);
		this.onUpdateLobby = this.onUpdateLobby.bind(this);
	}
}

const PROFILE_HTML = `
<div id="testLobby">
        <span id="lobbyView">
                <h1>Test lobby</h1>

                <div class="flex-column">
                        <div class="flex-row-between">
                                <h3>ID: <span>{{ lobbyId }}</span><span id="copyId" class="material-icons-round">content_copy</span></h3>
                                <h3>Players: <span>{{ numberOfPlayers }}</span></h3>
                        </div>
                        <div class="flex-row-between">
                                <h3>Language: <span>{{ language }}</span><h3>
                                <h3>Source: <span>{{ source }}</span></h3>
                        </div>
                        <div class="flex-row-between">
                                <h3>Time limit: <span>{{ timeLimit }}</span><h3>
                                <h3>Line limit: <span>{{ lineLimit }}</span></h3>
                        </div>
                        <div class="flex-row-evenly">
                                <h3 class="show-to-player">Waiting for host to start test</h3>
                                <button id="startTestButton" type="button" class="show-to-host">Start test</button>
                        </div>
                </div>
        </span>
        <span id="countdownView" class="hidden">
                <div>{{ startCountdownStep }}</div>
        </span>
</div>

<style>

#testLobby {
	width: 50%;
	margin: 0 auto;
}

#copyId {
	cursor: pointer;
	margin-left: 15px;
	user-select: none;
}

.show-to-player {
	display: none;
}

.show-to-host {
	display: none;
}

.hidden {
        display: none;
}

</style>
`;

export default TestLobbyScreen;
