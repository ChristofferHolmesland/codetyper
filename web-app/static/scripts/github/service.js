/**
 * @module github:service
 * @requires events:bus
 * @requires fireabse:api
 * @license GPL-3.0-only
 */

import { fireEvent, GITHUB_LIMIT_WARNING } from "../events/bus.js";
import * as API from "./api.js";

/**
 * List of languages that are not accepted as code.
 * @const
 * @type {array<string|null>}
 */
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

/**
 * Details about a gist from Github.
 * @typedef {object} GithubGist
 * @property {string} filename - Name of the uploaded file.
 * @property {string} language - Name of the language that is used in the file.
 * @property {string} raw_url - URL to where the code can be downloaded from.
 * @property {integer} size - Size of the code in bytes.
 * @property {string} type - MIME type of the content in the file.
 */

/**
 * List of gists that have been retrieved from Github, but not used yet.
 * @const
 * @type {array<GithubGist>}
 */
const gistBuffer = [];

/**
 * Checks how many requests that can be made to the Github API. Fires the GITHUB_LIMIT_WARNING event if the number is <= 10.
 * @async
 * @returns {integer} The number of requests that is left before the limit is reached.
 */
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

/**
 * Generates a random date.
 * @returns {string} Date in ISO format.
 */
function getRandomTimestamp() {
	const firstTime = new Date().getTime() - 2 * 365 * 24 * 60 * 60 * 1000;
	const lastTime = new Date().getTime() - 14 * 24 * 60 * 60 * 1000;

	const randomDate = new Date(
		firstTime + Math.random() * (lastTime - firstTime)
	);

	return randomDate.toISOString();
}

/**
 * Gets the next gist from the buffer, if the buffer is empty then it retrieves new gists from Github.
 * @async
 * @returns {GithubGist} A Github gist.
 */
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
