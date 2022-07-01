const path = require("path")
const express = require("express");
const chokidar = require("chokidar");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "..")))

app.listen(port, () => {
	console.log(`CodeTyper dev server listening on ${port}`);
});
