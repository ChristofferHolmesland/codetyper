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
import { getScreenObject, PICK_SCREEN } from "./screens.js";

/**
 * TestLobbyScreen is used to manage multiplayer games.
 * @class
 */
class TestLobbyScreen extends Screen {
	constructor(element) {
		super("Test Lobby", element, PROFILE_HTML, {
			lobbyId: "Creating lobby...",
			numberOfPlayers: 0,
		});
	}

	enter(payload) {
		super.enter(payload);
		this.bindFunctions();

		this.isInLobby = false;
		this.isHost = false;
		this.testStarting = false;

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

		return {};
	}

	onCreateLobby(socket, payload) {
		this.isInLobby = true;
		this.isHost = true;
		this.volatileData.lobbyId = payload;
		this.volatileData.numberOfPlayers = 1;
	}

	onJoinLobby(socket, payload) {
		this.isInLobby = true;
		this.volatileData.numberOfPlayers = payload.numberOfPlayers;
	}

	onDeleteLobby(socket, payload) {
		this.isInLobby = false;
		fireEvent(CHANGE_SCREEN, getScreenObject(PICK_SCREEN));
	}

	onStartLobby(socket, payload) {}

	onUpdateLobby(socket, payload) {
		if (payload.numberOfPlayers !== undefined) {
			this.volatileData.numberOfPlayers = payload.numberOfPlayers;
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
	<h1>Test lobby</h1>
	<h3>ID: <span>{{ lobbyId }}</span></h3>
	<h3>Players: <span>{{ numberOfPlayers }}</span></h3>
</div>

<style>
</style>
`;

export default TestLobbyScreen;
