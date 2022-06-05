import { fireEvent, GITHUB_LIMIT_WARNING } from "../events/bus.js";
import * as API from "./api.js";

const INVALID_LANGUAGES = [
	null,
	"Markdown",
	"Text",
	"SVG",
	"Jupyter Notebook",
	"CSV",
	"JSON",
	"XML",
	"YAML",
	"INI",
	"Diff",
];

const gistBuffer = [];

async function checkRateLimit() {
	const limit = await API.rateLimit()
		.then((resp) => resp.json())
		.then((resp) => resp.rate.remaining)
		.catch((err) => 0);

	if (limit <= 10) {
		fireEvent(GITHUB_LIMIT_WARNING, limit);
	}

	return limit;
}

function getRandomTimestamp() {
	const firstTime = new Date().getTime() - 2 * 365 * 24 * 60 * 60 * 1000;
	const lastTime = new Date().getTime() - 14 * 24 * 60 * 60 * 1000;

	const randomDate = new Date(
		firstTime + Math.random() * (lastTime - firstTime)
	);
	return randomDate.toISOString();
}

async function getRandomGist() {
	if (gistBuffer.length > 0) {
		return gistBuffer.shift();
	}

	const limit = await checkRateLimit();
	if (limit <= 0) {
		return;
	}

	return API.gistsPublic({
		since: getRandomTimestamp(),
		per_page: 100,
		page: 1 + Math.floor(Math.random() * 30),
	})
		.then((resp) => resp.json())
		.then((resp) => {
			for (let i = 0; i < resp.length; i++) {
				const files = resp[i].files;
				for (const file in files) {
					if (!files.hasOwnProperty(file))
						continue;
					if (files[file].size <= 50) continue;
					if (
						INVALID_LANGUAGES.includes(
							files[file].language
						)
					)
						continue;
					gistBuffer.push(files[file]);
				}
			}
		})
		.then(() => {
			return gistBuffer.shift();
		});
}

export { getRandomGist };
