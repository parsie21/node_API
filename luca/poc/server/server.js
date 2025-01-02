const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Ollama configuration
const ollamaServer = '192.168.1.231';
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

// Middleware to parse JSON
app.use(express.json());

// Endpoint to listen for signals
app.post('/trigger', async (req, res) => {
    try {
    /*
    qui requirement potremmo sostituirlo con una stringa che rappresenta 
    il codice del file scelto in vsc, giusto per mostrare che funziona
    rappresenta comunque il prompt dato alla chat
    */
        console.log("trying");
        // const { requirement } = req.body; // Expecting { requirement: "text" }
        const { requirement } = { requirement: "print('Hello World')" }
        if (!requirement) {
            console.log("requirements not provided");
            return res.status(400).json({ error: 'Requirement not provided' });
        }

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

        console.log('Ollama response:', ollamaResponse.data.response);

        res.status(200).json({ ollamaResponse: ollamaResponse.data.response });
    } catch (error) {
        console.error('Error during Ollama API call:', error.message);
        res.status(500).json({ error: 'Failed to process the requirement' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
