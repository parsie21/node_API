//Importo axios
const axios = require('axios');
const { resolve } = require('path');

//Dati per la connessione
const ollamaServer = '192.168.1.231'
const ollamaPort = '11434'

//Contesto 
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
                            Requisito:`

//-------------------------------
//Main:
model = 'llama3.2:latest';
prompt = 'Ciao dimmi come si costruisce un tavolo';

// sendPromptToOllama(model,prompt);


var requisito = "La funzione deve calcolare e stampare i primi numeri di Fibonacci.";
analyzeRequirementWithOllama(requisito);

//Da fare:
//analyzeCodeWithOllama
//generateCodeWithOllama

function analyzeRequirementWithOllama(requirement) {
    console.log('analyzeRequirementWithOllama(requirement)');  
    axios.post('http://' + ollamaServer + ':' + ollamaPort + '/api/generate',
        {
            model: model,
            system: requirementsContext,
            prompt: requirement,
            stream: false
        }
    )
        .then(res => {
            console.log('Risposta:', res.data.response);
        }
        )
        .catch(err => console.log('Errore:' + err));
}

function sendPromptToOllama(model, prompt) {
    console.log('sendPromptToOllama(model, prompt)');

    axios.post('http://' + ollamaServer + ':' + ollamaPort + '/api/generate',
        {
            model: model,
            prompt: prompt,
            stream: false
        }
    )
        .then(res => {
            console.log('Risposta:', res.data.response);
        }
        )
        .catch(err => console.log('Errore:' + err));
}


function sendPromptToOllamaa(prompt) {
    console.log('sendPromptToOllama(prompt)')
    axios.post('http://' + ollamaServer + ':' + ollamaPort + '/api/generate',
        {
            model: 'llama3.2:latest',
            prompt: prompt,
            stream: false
        }
    )
        .then(res => {
            console.log('Risposta:', res.data.response);
        }
        )
        .catch(err => console.log('Errore:' + err));
}
//---------------------------------

// function TestPromptProvaNoStream() {
//     console.log('TestPromptProvaNoStream');

//     axios.post('http://192.168.1.231:11434/api/generate',
//         {
//             model: 'llama3.2:latest',
//             prompt: "Ciao! Questo è un test! Rispondi 'Hello World' se mi leggi per favore",
//             stream: false
//         }
//     )
//         .then(res => {
//             console.log('Risposta completa:', res.data.response);
//         }
//         )
//         .catch(err => console.log(err));
// } 

//  function TestPromptBase() {
//      console.log('TestPromptBase');
//      axios.post('http://192.168.1.231:11434/api/generate',
//          {
//              model: 'llama3.2:latest',
//              prompt: "Ciao! Questo è un test! Rispondi 'Hello World' se mi leggi per favore",
//              // format: "json"
//          }
//      )
//           .then(res => {
//               let fullResponse = ''

//               res.data.split('\n').forEach(line => {
//                   if (line) {
//                       const json = JSON.parse(line); // Parso ogni riga come JSON
//                       fullResponse += json.response;  // Aggiungo la risposta parziale al testo complet
//                       // Se il flag 'done' è true, stampo la risposta completa
//                       if (json.done) {
//                           console.log('Risposta completa:', fullResponse);
//                       }
//                   }
//               });
//           })
//           .catch(err => console.log(err));
//  }                
                

// function TestPromptProvaNoStreamConContesto() {
//     console.log('TestPromptProvaNoStreamConContesto');

//     axios.post('http://192.168.1.231:11434/api/generate',
//         {
//             model: 'llama3.2:latest',
//             prompt: "Ciao! Questo è un test! Rispondi 'Hello World' se mi leggi per favore",
//             system: "Sei una persona che parla solo all'incontrario, quindi tutte le parole saranno inverse, ad esempio 'ciao come stai' diventa 'stai come ciao'",
//             stream: false
//         }
//     )
//         .then(res => {
//             console.log('Risposta completa:', res.data.response);
//         }
//         )
//         .catch(err => console.log(err));
//     }