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
		};
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
		changeScreen(TEST_SCREEN);
	}

	setupButtons() {
		const container = document.getElementById("actual-buttons");

		for (let i = 0; i < CODE_SNIPPETS.length; i++) {
			const button = document.createElement("button");

			button.classList.add("btn");
			button.classList.add("githubbutton");
			button.innerHTML = CODE_SNIPPETS[i].language;

			button.addEventListener("click", () =>
				this.buttonClicked(i)
			);

			container.appendChild(button);
		}
	}

	addGitHubLinkHandler() {
		document.getElementById("githubbutton").addEventListener(
			"click",
			() => {
				var link =
					document.getElementById(
						"githubinput"
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

					extn = link
						.split("/")
						.pop()
						.split(".")
						.pop();

					langs = {
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
						changeScreen(TEST_SCREEN);
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
	<br />
	<span id="actual-buttons" class="flex-row"></span>
</div>
<br />
<div class="code-chooser">
	<input
		id="githubinput"
		type="text"
		placeholder="Or enter Github link"
	/>
	<button id="githubbutton">
		<span class="material-icons-round">
			arrow_right
		</span>
	</button>
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
