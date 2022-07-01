const path = require("path");
const child_process = require("child_process");
const chokidar = require("chokidar");

function createServerProcess() {
	const process = child_process.spawn("node", [path.join(__dirname, "/server.js")]);

	process.stdout.on("data", (data) => {
		console.log(`${data}`);
	});

	process.stderr.on("data", (data) => {
		console.log(`${data}`);
	});

	return process;
}

let server = createServerProcess();

chokidar.watch(path.join(__dirname, "/server.js")).on("change", (event, path) => {
	console.log("Detected changes in the server. Reloading...");
	server.kill();
	server = createServerProcess();
});