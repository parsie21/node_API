const vscode = require('vscode');
const axios = require('axios')


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log("L'estensione è attiva");

	// Associa comando package.json (estensione) a funzione
	const requirementToOllamaCommand = vscode.commands.registerCommand('sendSignal.sendRequirementToOllama', function () {
		sendRequirementToOllama();
	});

		//Da finire
		const generateCodeWithOllamaCommand = vscode.commands.registerCommand('sendSignal.generateCodeWithOllama', function () {
			generateCodeWithOllama();
		});
	

	context.subscriptions.push(requirementToOllamaCommand);
	context.subscriptions.push(generateCodeWithOllamaCommand);

}

function deactivate() {}

//Quando viene chiamato il signal
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

//Da fare
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
