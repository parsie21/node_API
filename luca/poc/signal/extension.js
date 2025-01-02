const vscode = require('vscode');
const axios = require('axios')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Your extension "ExtensionSignal" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('sendSignal.sendSignalToServer', function () {
		// The code you place here will be executed every time your command is executed
		sendSignal();
	});

	

	context.subscriptions.push(disposable);
}

function deactivate() {}

//When Signal is called:
var server = require('../server/server.js');
var expressPort = server.expressPort;
var expressServer = server.expressServer;

async function sendSignal() {
	try {
		const response = await axios.post('http://'+expressServer+':'+expressPort+'/analyzeRequirement', {
			source : 'vscode-extension',
			timestamp: new Date().toISOString(),
		})

		console.log('Signal Sent Successfully', response.data);
		vscode.window.showInformationMessage('Signal Sent Successfully');
		
	} catch (error) {
		console.error('Error sending signal', error);
		vscode.window.showErrorMessage('Error sending signal');
	}
}

module.exports = {
	activate,
	deactivate
}
