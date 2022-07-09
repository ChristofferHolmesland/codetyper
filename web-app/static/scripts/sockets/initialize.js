/**
 * @module sockets:initialize
 * @license GPL-3.0-only
 */

const socket = new WebSocket("ws://localhost:8080");

export const version = "v1";
export const CREATE_LOBBY = `/${version}/lobby/create`;
export const JOIN_LOBBY = `/${version}/lobby/join`;
export const DELETE_LOBBY = `/${version}/lobby/delete`;
export const START_LOBBY = `/${version}/lobby/start`;

const handlers = {};

socket.addEventListener("open", function (event) {
	console.log("WebSocket connection is open");
});

socket.addEventListener("message", function (event) {
	const data = JSON.parse(event.data);

	if (handlers[data.topic] === undefined) return;

	for (let i = 0; i < handlers[data.topic].length; i++) {
		handlers[data.topic][i](socket, data.payload);
	}
});

function addHandler(topic, func) {
	if (handlers[topic] === undefined) {
		handlers[topic] = [];
	}

	handlers[topic].push(func);
}

function removeHandler(topic, func) {
	if (handlers[topic] === undefined) return;

	const index = handlers[topic].indexOf(func);
	if (index === -1) return;

	handlers[topic].splice(index, 1);
}

function sendMessage(topic, payload) {
	socket.send(
		JSON.stringify({
			topic: topic,
			payload: payload,
		})
	);
}

export { addHandler, removeHandler, sendMessage };
