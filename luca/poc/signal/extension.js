const vscode = require('vscode');
const axios = require('axios')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Your extension "sendSignal" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const requirementToOllamaCommand = vscode.commands.registerCommand('sendSignal.sendRequirementToOllama', function () {
		// The code you place here will be executed every time your command is executed
		sendRequirementToOllama();
	});
	const generateCodeWithOllamaCommand = vscode.commands.registerCommand('sendSignal.generateCodeWithOllama', function () {
		// The code you place here will be executed every time your command is executed
		generateCodeWithOllama();
	});
	

	context.subscriptions.push(requirementToOllamaCommand);
	context.subscriptions.push(generateCodeWithOllamaCommand);

}

function deactivate() {}

//When Signal is called:
var server = require('../server/server.js');
var expressPort = server.expressPort;
var expressServer = server.expressServer;

async function sendRequirementToOllama() {
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

async function generateCodeWithOllama() {
	try {
		const response = await axios.post('http://'+expressServer+':'+expressPort+'/generateCode', {
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
