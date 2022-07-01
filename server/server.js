const fs = require("fs");
const path = require("path")
const express = require("express");
const chokidar = require("chokidar");

const app = express();
const port = 3000;

const injectHTML = `
<script src="/server/inject.js"></script>
</head>
`;

const updateLog = {};
const parentDir = path.join(__dirname, "..");

app.use("/", (req, res, next) => {
	if (req.url !== "/") {
		return next();
	}

	let content = fs.readFileSync(path.join(__dirname, "../index.html")).toString();
	content = content.replace("</head>", injectHTML);

	res.status(200).send(content);
})

app.use(express.static(path.join(__dirname, "..")))

function handleFileChange(event, path) {
	const webPath = event.replace(parentDir, "").replaceAll("\\", "/");
	console.log("Detected change in file: " + webPath);
	updateLog[webPath] = Date.now();
}

chokidar.watch(path.join(__dirname, "../static/styles/")).on("change", handleFileChange);
chokidar.watch(path.join(__dirname, "../static/scripts/")).on("change", handleFileChange);

app.get("/api/changes", (req, res) => {
	let since = parseInt(req.query.since);
	if (isNaN(since)) {
		return res.status(400).send();
	}

	const response = {
		ts: 0,
		files: []
	};

	for (const webPath in updateLog) {
		const ts = updateLog[webPath];

		if (ts > since) {
			response.files.push(webPath);
			
			if (ts > response.ts) {
				response.ts = ts;
			}
		}
	}

	res.status(200).json(response);
})

app.listen(port, () => {
	console.log(`CodeTyper dev server listening on ${port}`);
});
