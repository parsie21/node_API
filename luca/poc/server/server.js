const express = require('express');
const axios = require('axios');

//Express configuration
const app = express();
const expressServer = 'localhost'
const expressPort = 4000;

module.exports.expressServer = expressServer;
module.exports.expressPort = expressPort;

app.listen(expressPort, () => {
    console.log(`Express server is running on port ${expressPort}`);
});


// Ollama configuration
const ollamaServer = 'localhost';
const ollamaPort = '11434';
const model = 'llama3.2:latest';
const requirementsContext = `Analizza il seguente requisito software e valuta la sua semantica.
                            Rispondi esclusivamente con un file JSON nel seguente formato:
                                {
                                    "passed": <true/false>,
                                    "suggestions": [
                                        "Suggerimento 1",
                                        "Suggerimento 2",
                                        ...
                                    ]
                                }
                            Regole di valutazione:
                            - Il requisito deve essere chiaro, completo, non ambiguo, e tecnicamente corretto.
                            - Segnala "passed: false" se il requisito è vago, incompleto, ambiguo, o non corretto.
                            - Nella lista "suggestions", specifica come migliorare il requisito (es. chiarire dettagli, rimuovere ambiguità, completare informazioni mancanti).
                            
                            Sii molto critico e stringente, sei un programmatore che deve valutare i requisiti che deve implementare nel codice per evitare che siano ambigui.
                            Non rispondere a caso se non riesci a valutare efficacemente il requisito, se hai dubbi o sei insicuro, dai passed:false
                            Requisito:`;

const requirement = 'La funzione deve calcolare i primi n numeri di Fibonacci';


// Endpoint to listen for signals
app.post('/analyzeRequirement', async (req, res) => {
    try {
        console.log("/analyzeRequirement endpoint called");
        console.log('Signal received:', requirement);

        // Call Ollama API
        const ollamaResponse = await axios.post(
            `http://${ollamaServer}:${ollamaPort}/api/generate`,
            {
                model: model,
                system: requirementsContext,
                prompt: requirement,
                stream: false
            }
        );
        //Print Ollama response
        console.log('Ollama response:', ollamaResponse.data.response);
        res.status(200).json({ ollamaResponse: ollamaResponse.data.response });

    } catch (error) {
        console.error('Error during Ollama API call:', error.message);
        res.status(500).json({ error: 'Failed to process the requirement' });
    }
});

const generateCodeContext = `Analizza il seguente requisito software e valuta la sua semantica.
                            Rispondi esclusivamente con un file JSON nel seguente formato:
                                {
                                    "passed": <true/false>,
                                    "suggestions": [
                                        "Suggerimento 1",
                                        "Suggerimento 2",
                                        ...
                                    ]
                                }
                            Regole di valutazione:
                            - Il requisito deve essere chiaro, completo, non ambiguo, e tecnicamente corretto.
                            - Segnala "passed: false" se il requisito è vago, incompleto, ambiguo, o non corretto.
                            - Nella lista "suggestions", specifica come migliorare il requisito (es. chiarire dettagli, rimuovere ambiguità, completare informazioni mancanti).
                            
                            Sii molto critico e stringente, sei un programmatore che deve valutare i requisiti che deve implementare nel codice per evitare che siano ambigui.
                            Non rispondere a caso se non riesci a valutare efficacemente il requisito, se hai dubbi o sei insicuro, dai passed:false
                            Requisito:`;
                            
app.post('/generateCode', async (req, res) => {
    try {
        console.log("/generateCode endpoint called");
        console.log('Signal received:', requirement);

        // Call Ollama API
        const ollamaResponse = await axios.post(
            `http://${ollamaServer}:${ollamaPort}/api/generate`,
            {
                model: model,
                system: generateCodeContext,
                prompt: code,
                stream: false
            }
        );
        //Print Ollama response
        console.log('Ollama response:', ollamaResponse.data.response);
        res.status(200).json({ ollamaResponse: ollamaResponse.data.response });

    } catch (error) {
        console.error('Error during Ollama API call:', error.message);
        res.status(500).json({ error: 'Failed to process the requirement' });
    }
});
// Middleware to parse JSON
app.use(express.json());