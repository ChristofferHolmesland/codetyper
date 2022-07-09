const dotenv = require("dotenv");
dotenv.config();

const port = parseInt(process.env.PORT);
if (isNaN(port)) {
	console.log(
		"PORT environment variable must be set to start the server."
	);
	process.exit(1);
}

let use_tls = process.env.USE_TLS;
if (use_tls === undefined || (use_tls !== "true" && use_tls !== "false")) {
	console.log("USE_TLS environment variable must be 'true' or 'false'.");
	process.exit(1);
} else {
	use_tls = use_tls === "true";
}

const ws = require("ws");
const fs = require("fs");
const https = require("https");

let wss;
let httpsServer;

if (use_tls) {
	const httpsOptions = {
		key: fs.readFileSync(TLS_KEY_FILE),
		cert: fs.readFileSync(TLS_CERT_FILE),
		ca: fs.readFileSync(TLS_CA_FILE),
	};

	httpsServer = https.createServer(httpsOptions);
	wss = new ws.WebSocketServer({ server: httpsServer });
} else {
	wss = new ws.WebSocketServer({ port: port });
}

function heartbeat() {
	this.isAlive = true;
}

const version = "v1";
const CREATE_LOBBY = `/${version}/lobby/create`;
const JOIN_LOBBY = `/${version}/lobby/join`;
const DELETE_LOBBY = `/${version}/lobby/delete`;
const START_LOBBY = `/${version}/lobby/start`;

const lobbies = {};

function generateLobby() {
	while (true) {
		const min = 100000000;
		const max = 2000000001;
		const rnd = Math.floor(Math.random() * (max - min)) + min;
		const id = rnd.toString(36);

		if (lobbies[id] === undefined) {
			lobbies[id] = {
				id: id,
			};

			return lobbies[id];
		}
	}
}

function createLobby(socket, payload) {
	const lobby = generateLobby();

	lobby.host = socket;
	lobby.sockets = [socket];

	lobby.code = payload.code;
	lobby.source = payload.source;
	lobby.language = payload.language;
	lobby.lineLimit = payload.lineLimit;
	lobby.timeLimit = payload.timeLimit;

	socket.send(
		JSON.stringify({
			topic: CREATE_LOBBY,
			payload: lobby.id,
		})
	);
}

function joinLobby(socket, payload) {
	const lobby = lobbies[payload];

	if (lobby === undefined) {
		return;
	}

	const playerId = lobby.sockets.push(socket);

	socket.send(
		JSON.stringify({
			topic: JOIN_LOBBY,
			payload: {
				numberOfPlayers: lobby.sockets.length,
				playerId: playerId,
				code: lobby.code,
				source: lobby.source,
				language: lobby.language,
				lineLimit: lobby.lineLimit,
				timeLimit: lobby.timeLimit,
			},
		})
	);
}

function deleteLobby(socket, payload) {}

function startLobby(socket, payload) {}

wss.on("connection", function connection(socket) {
	socket.isAlive = true;
	socket.on("pong", heartbeat);

	socket.on("message", function message(data) {
		try {
			data = JSON.parse(data);
		} catch (err) {
			return;
		}

		if (data.topic === undefined) {
			return;
		}

		switch (data.topic) {
			case CREATE_LOBBY:
				createLobby(socket, data.payload);
				break;
			case JOIN_LOBBY:
				joinLobby(socket, data.payload);
				break;
			case DELETE_LOBBY:
				deleteLobby(socket, data.payload);
				break;
			case START_LOBBY:
				startLobby(socket, data.payload);
				break;
		}
	});
});

const interval = setInterval(function ping() {
	for (let i = 0; i < wss.clients.length; i++) {
		const socket = wss.clients[i];
		if (socket.isAlive === false) {
			socket.terminate();
			continue;
		}

		socket.isAlive = false;
		socket.ping();
	}
}, 30000);

wss.on("close", function close() {
	clearInterval(interval);
});

if (use_tls) {
	httpsServer.listen(port);
}
