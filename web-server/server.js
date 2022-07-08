const dotenv = require("dotenv");
dotenv.config();

const port = parseInt(process.env.PORT);
if (isNaN(port)) {
	console.log("PORT environment variable must be set to start the server.");
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
		ca: fs.readFileSync(TLS_CA_FILE)
	};

	httpsServer = https.createServer(httpsOptions);
	wss = new ws.WebSocketServer({ server: httpsServer });
} else {
	wss = new ws.WebSocketServer({ port: port });
}

function heartbeat() {
	this.isAlive = true;
}


wss.on("connection", function connection(socket) {
	socket.isAlive = true;
	socket.on("pong", heartbeat);

	socket.on("message", function message(data) {
		console.log(data.toString());
		socket.send(JSON.stringify({
			topic: "/v1/hello",
			payload: "Hello :=)"
		}));
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