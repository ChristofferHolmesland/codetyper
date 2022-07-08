/**
 * @module sockets:initialize
 * @license GPL-3.0-only
 */

 const socket = new WebSocket("ws://localhost:8080");

 socket.addEventListener("open", function (event) {
	socket.send("Hello World!");
	console.log("WebSocket connection is open");
 });

 socket.addEventListener("message", function(event) {
	console.log("Message from server ", event);
 });

 export default socket;