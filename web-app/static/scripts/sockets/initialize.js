/**
 * @module sockets:initialize
 * @license GPL-3.0-only
 */

export const version = "v1";
export const CREATE_LOBBY = `/${version}/lobby/create`;
export const JOIN_LOBBY = `/${version}/lobby/join`;
export const DELETE_LOBBY = `/${version}/lobby/delete`;
export const START_LOBBY = `/${version}/lobby/start`;
export const UPDATE_LOBBY = `/${version}/lobby/update`;
export const FINISHED_TEST = `/${version}/test/finished`;
export const UPDATE_TEST_RESULT = `/${version}/test/update-result`;

let addHandler = () => {};
let removeHandler = () => {};
let sendMessage = () => {};

try {
        let websocketHost;

        if (window.location.hostname === "localhost") {
                websocketHost = "ws://localhost:8080";
        } else if (window.location.hostname === "christofferholmesland.github.io") {
                websocketHost = "ws://129.159.206.123:8080";;
        } else {
                console.log("No known WebSocket server for this host.");
        }

        const socket = new WebSocket(websocketHost);

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

        addHandler = function(topic, func) {
                if (handlers[topic] === undefined) {
                        handlers[topic] = [];
                }

                handlers[topic].push(func);
        }

        removeHandler = function(topic, func) {
                if (handlers[topic] === undefined) return;

                const index = handlers[topic].indexOf(func);
                if (index === -1) return;

                handlers[topic].splice(index, 1);
        }

        sendMessage = function(topic, payload) {
                socket.send(
                        JSON.stringify({
                                topic: topic,
                                payload: payload,
                        })
                );
        }
} catch (error) {
        console.log('Websocket connection failed');
}

export { addHandler, removeHandler, sendMessage };
