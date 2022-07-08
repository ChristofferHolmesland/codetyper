// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "codetyper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('codetyper.openTest', function () {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			const documentText = document.getText();
			let code = Buffer.from(unescape(encodeURIComponent(documentText))).toString("base64");

			const panel = vscode.window.createWebviewPanel(
				"codetyper",
				"Codetyper",
				vscode.ViewColumn.One,
				{
					enableScripts: true
				}
			);

			panel.webview.html = getWebviewContent(code);
		}
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(code64) {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Codetyper</title>
		<style>
			iframe {
				position: absolute;
				top: 25px;
			}
		</style>
	</head>
	<body>
		<iframe src="https://christofferholmesland.github.io/codetyper/?test=${code64}" width="100%" height="800" sandbox="allow-scripts allow-same-origin" ></iframe>
	</body>
	</html>`;
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
