/**
 * @module github:api
 * @license GPL-3.0-only
 */

/**
 * URL of Github API
 * @const
 * @type {string}
 */
const BASE_URL = "https://api.github.com/";
/**
 * Header value required for every Github API request
 * @const
 * @type {object}
 */
const BASE_OPTIONS = {
	headers: {
		Accept: "application/vnd.github.v3+json",
	},
};

/**
 * Gets the current API rate limit
 * @async
 * @returns {Promise<Response>} Promise that resolves with the response of the request.
 */
export async function rateLimit() {
	return fetch(BASE_URL + "rate_limit", BASE_OPTIONS);
}

/**
 * Parameters required to search public gists.
 * @typedef {object} PublicGistsParams
 * @property {string} since - ISO formatted date object that limits how old the gists can be.
 * @property {integer} per_page - How many gists are that are returned from each request, max 100.
 * @property {integer} page - Which page of the results that should be returned. It's only possible to browse 3000 gists.
 */

/**
 * Gets public gists from Github.
 * @param {PublicGistsParams} params - Search parameters: {@link PublicGistsParams}
 * @returns {Promise<Response>} Promise that resolves with the response of request.
 */
export async function gistsPublic(params) {
	const fields = [];

	if (params === undefined) params = {};
	if (params.since !== undefined) fields.push("since=" + params.since);
	if (params.per_page !== undefined)
		fields.push("per_page=" + params.per_page);
	if (params.page !== undefined) fields.push("page=" + params.page);

	if (fields.length === 0)
		return fetch(BASE_URL + "gists/public", BASE_OPTIONS);

	return fetch(
		BASE_URL + "gists/public?" + fields.join("&"),
		BASE_OPTIONS
	);
}
