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

app.use("/", (req, res, next) => {
	if (req.url !== "/") {
		return next();
	}

	let content = fs.readFileSync(path.join(__dirname, "../index.html")).toString();
	content = content.replace("</head>", injectHTML);

	res.status(200).send(content);
})

app.use(express.static(path.join(__dirname, "..")))

chokidar.watch(path.join(__dirname, "../static/styles/")).on("change", (event, path) => {
	console.log(event);
});

app.listen(port, () => {
	console.log(`CodeTyper dev server listening on ${port}`);
});
