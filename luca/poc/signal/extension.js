// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "signal" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('sendSignal.sendSignalToServer', function () {
		// The code you place here will be executed every time your command is executed
		sendSignal();
	});

	

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

async function sendSignal() {
	try {
		const response = await axios.post('http://localhost:3000/trigger', {
			source : 'vscode-extension',
			timestamp: new Date().toISOString(), //add current timestamp
		})

		console.log('signal sent successfully', response.data);
		vscode.window.showInformationMessage('signal sent successfully');
	} catch (error) {
		console.error('Error sending signal', error);
		vscode.window.showErrorMessage('Error sending signal');
	}
}

module.exports = {
	activate,
	deactivate
}
