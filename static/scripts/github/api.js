const BASE_URL = "https://api.github.com/";
const BASE_OPTIONS = {
	headers: {
		Accept: "application/vnd.github.v3+json",
	},
};

export async function rateLimit() {
	return fetch(BASE_URL + "rate_limit", BASE_OPTIONS);
}

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
