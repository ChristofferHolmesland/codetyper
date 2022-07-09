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
} from "../sockets/initialize.js";

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

		addHandler(CREATE_LOBBY, this.onCreateLobby);
		addHandler(JOIN_LOBBY, this.onJoinLobby);
		addHandler(DELETE_LOBBY, this.onDeleteLobby);
		addHandler(START_LOBBY, this.onStartLobby);

		if (payload.lobbyId === undefined) {
			sendMessage(CREATE_LOBBY, payload);
		} else {
			this.volatileData.lobbyId = payload.lobbyId;
			sendMessage(JOIN_LOBBY, payload.lobbyId);
		}
	}

	leave() {
		removeHandler(CREATE_LOBBY, this.onCreateLobby);
		removeHandler(JOIN_LOBBY, this.onJoinLobby);
		removeHandler(DELETE_LOBBY, this.onDeleteLobby);
		removeHandler(START_LOBBY, this.onStartLobby);

		return {};
	}

	onCreateLobby(socket, payload) {
		this.volatileData.lobbyId = payload;
		this.volatileData.numberOfPlayers = 1;
	}

	onJoinLobby(socket, payload) {
		this.volatileData.numberOfPlayers = payload.numberOfPlayers;
	}

	onDeleteLobby(socket, payload) {}

	onStartLobby(socket, payload) {}

	bindFunctions() {
		this.onCreateLobby = this.onCreateLobby.bind(this);
		this.onJoinLobby = this.onJoinLobby.bind(this);
		this.onDeleteLobby = this.onJoinLobby.bind(this);
		this.onStartLobby = this.onStartLobby.bind(this);
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
