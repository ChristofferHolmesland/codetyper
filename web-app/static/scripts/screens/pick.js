/**
 * @module screens:PickScreen
 * @requires screens:screens
 * @requires screen:screen
 * @requires events:bus
 * @requires github:service
 * @license GPL-3.0-only
 */

import Screen from "./screen.js";
import { getScreenObject, TEST_SCREEN, TEST_LOBBY_SCREEN } from "./screens.js";
import { fireEvent, CHANGE_SCREEN } from "../events/bus.js";
import { getRandomGist } from "../github/service.js";

/**
 * PickScreen is used to let the user pick which test they want to do.
 * @class
 */
class PickScreen extends Screen {
	constructor(element) {
		super("Pick!", element, PICK_SCREEN_HTML);
	}

	enter(payload) {
		super.enter(payload);

		this.lineLimitElement = document.getElementById("line_limit");
		this.timeLimitElement = document.getElementById("time_limit");
		this.addClearListener(this.lineLimitElement);
		this.addClearListener(this.timeLimitElement);

		this.setupButtons();
		this.addGitHubLinkHandler();
		this.addRandomGistHandler();
		this.checkURLParameters();
	}

	leave() {
		let lineLimit = this.lineLimitElement.value;
		if (lineLimit.length > 0) {
			lineLimit = parseInt(lineLimit, 10);
		} else {
			lineLimit = -1;
		}

		let timeLimit = this.timeLimitElement.value;
		if (timeLimit.length > 0) {
			timeLimit = parseInt(timeLimit, 10);
		} else {
			timeLimit = false;
		}

		this.lineLimitElement = undefined;
		this.timeLimitElement = undefined;

		return {
			code: this.code,
			source: this.source,
			language: this.language,
			lineLimit: lineLimit,
			timeLimit: timeLimit,
			lobbyId: this.lobbyId,
		};
	}

	checkURLParameters() {
		const urlParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlParams.entries());

		if (params.test !== undefined) {
			this.code = decodeURIComponent(
				escape(window.atob(params.test))
			);
			this.source = "External";
			this.language = "Unknown";

			fireEvent(CHANGE_SCREEN, getScreenObject(TEST_SCREEN));
			return;
		}

		if (params.lobbyId !== undefined) {
			this.lobbyId = params.lobbyId;
			fireEvent(
				CHANGE_SCREEN,
				getScreenObject(TEST_LOBBY_SCREEN)
			);
		}
	}

	goToTestScreen() {
		if (this.experimental === false) {
			fireEvent(CHANGE_SCREEN, getScreenObject(TEST_SCREEN));
			return;
		}

		const singlePlayer =
			document.getElementById("singleplayer").checked;
		if (singlePlayer) {
			fireEvent(CHANGE_SCREEN, getScreenObject(TEST_SCREEN));
		} else {
			this.lobbyId = undefined;
			fireEvent(
				CHANGE_SCREEN,
				getScreenObject(TEST_LOBBY_SCREEN)
			);
		}
	}

	addClearListener(element) {
		element.addEventListener("input", (e) => {
			if (e.target.value == "") {
				element.style.width = "80px";
			}
		});
	}

	buttonClicked(index) {
		this.source = "Codetyper";
		this.code = CODE_SNIPPETS[index].code;
		this.language = CODE_SNIPPETS[index].language;
		this.goToTestScreen();
	}

	setupButtons() {
		const container = document.getElementById("actual-buttons");

		for (let i = 0; i < CODE_SNIPPETS.length; i++) {
			const button = document.createElement("button");

			button.classList.add("btn");
			button.classList.add("github-btn");
			button.innerHTML = CODE_SNIPPETS[i].language;

			button.addEventListener("click", () =>
				this.buttonClicked(i)
			);

			container.appendChild(button);
		}
	}

	addRandomGistHandler() {
		document.getElementById("random-gist-btn").addEventListener(
			"click",
			async () => {
				// indicate loading
				document.getElementById(
					"github-btn"
				).classList.add("is-loading");
				// removing the span
				document.getElementById(
					"random-gist-btn"
				).classList.add("is-loading");
				// disabling inputs
				[
					...document.querySelectorAll(
						"[id=line_limit]"
					),
					document.getElementById("github-input"),
				].forEach((element) =>
					element.setAttribute("disabled", "")
				);
				const gist = await getRandomGist();

				console.log(gist);

				this.language = gist.language;
				this.source = `<a href=${gist.raw_url} target="blank">Github</a>`;

				fetch(gist.raw_url).then((response) => {
					response.text().then((data) => {
						this.code = data;
						this.goToTestScreen();
					});
				});
				// regainging old state
				document.getElementById(
					"github-btn"
				).classList.remove("is-loading");
				document.getElementById(
					"random-gist-btn"
				).classList.remove("is-loading");
				[
					...document.querySelectorAll(
						"[id=line_limit]"
					),
					document.getElementById("github-input"),
				].forEach((element) =>
					element.removeAttribute("disabled")
				);
			}
		);
	}

	addGitHubLinkHandler() {
		document.getElementById("github-btn").addEventListener(
			"click",
			() => {
				var link =
					document.getElementById(
						"github-input"
					).value;
				if (link.length === 0) return;

				if (
					link.includes("github.com/") ||
					link.includes("raw.githubusercontent")
				) {
					this.source = `<a href=${link} target="blank">Github</a>`;
					link = link
						.replace(
							"github.com",
							"raw.githubusercontent.com"
						)
						.replace("/blob", "");

					var extn = link
						.split("/")
						.pop()
						.split(".")
						.pop();

					var langs = {
						js: "Javascript",
						py: "Python",
						cs: "C#",
						rs: "Rust",
						html: "HTML",
						css: "CSS",
						cpp: "C++",
						kt: "Kotlin",
						md: "Markdown",
						kts: "Kotlin",
					};

					if (extn in langs) {
						this.language = langs[extn];
					} else {
						this.language =
							extn
								.charAt(0)
								.toUpperCase() +
							extn.slice(1);
					}
				}

				fetch(link).then((response) => {
					response.text().then((data) => {
						this.code = data;
						this.goToTestScreen();
					});
				});
			}
		);
	}
}

const PICK_SCREEN_HTML = `
<div id="selectDiv">
<div id="lang-buttons" class="lang-buttons">
	<p>Choose a language to start with</p>
	<div class="experimental">
		<input type="radio" id="singleplayer" name="mode" value="singleplayer">
		<label for="singleplayer">Singleplayer</label>
		<input type="radio" id="multiplayer" name="mode" value="multiplayer" checked>
		<label for="multiplayer">Multiplayer</label>
	</div>
	<br />
	<span id="actual-buttons" class="flex-row"></span>
</div>
<br />
<div class="code-chooser">
	<input
		id="github-input"
		type="text"
		placeholder="Or, enter Github link"
	/>
	<button id="github-btn">
        <div class="github-btn-lsp"></div>
		<span class="material-icons-round">
			arrow_right
		</span>
	</button>
</div>
<div style="display: inline-block; margin-top: 15px;" class="code-chooser">
<div id="random-gist-btn">
        <span>Or, try some random code from Github</span>
</div>
</div>
<br />
<br />
<div id="limits">
	<label>Stop my test after</label>
	<input
		id="line_limit"
		min="1"
		onkeypress="this.style.width = ((this.value.length + 1) * 8) + 'px';"
		placeholder="unlimited"
		class="number-box"
	/>
	<label>lines and</label>
	<input
		id="time_limit"
		min="1"
		placeholder="unlimited"
		onkeypress="this.style.width = ((this.value.length + 1) * 8) + 'px';"
		class="number-box"
	/>
	<label>seconds.</label>
</div>
</div>
`;

const CODE_SNIPPETS = [
	{
		language: "Bash",
		code: `#!/bin/bash

hello_world () {
	echo 'Hello, World!'
}

hello_world`,
	},
	{
		language: "C",
		code: `int main() {
	printf("Hello, World!");
	return 0;
}`,
	},
	{
		language: "C#",
		code: `static void Main(string[] args) {
	System.Console.WriteLine("Hello World!");
}`,
	},
	{
		language: "C++",
		code: `int main() {
	std::cout << "Hello World!";
	return 0;
}`,
	},
	{
		language: "Go",
		code: `func main() {
	fmt.Println("Hello, World!")
}`,
	},
	{
		language: "Java",
		code: `public static void main(String[] args) {
	String greeting = "Hello";
	System.out.println(greeting);
}`,
	},
	{
		language: "JavaScript",
		code: `function main() {
	console.log("Hello, World!");
};
main();`,
	},
	{
		language: "Kotlin",
		code: `fun main() {
	println("Hello, World!")
}`,
	},
	{
		language: "Python",
		code: `if __name__ == "__main__":
	print("Hello, world!")
	print(" - Christoffer")`,
	},
	{
		language: "Rust",
		code: `fn main() {
	println!("Hello World!");
}`,
	},
];

export default PickScreen;
