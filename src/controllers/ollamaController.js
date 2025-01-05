const ollamaService = require('../services/ollamaService');

exports.analyzeRequirement = async (req, res) => {
  try {
    const { id, requirement, code } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID is required and must be a string' });
    }
    else if (!requirement || typeof requirement !== 'string') {
      return res.status(400).json({ error: 'Requirement is required and must be a string' });
    }
    else if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required and must be a string' });
    }

    //Analisi semantica requisito
    const requirementModel = 'llama3.2:1b';
    const requirementContext = `Analizza il seguente requisito software e valuta la sua semantica.
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

    const requirementAnalysis = await ollamaService.sendMessageToOllama(requirementModel, requirement, requirementContext);

    //Analisi del codice
    const codeModel = 'llama3.2:1b';
    const codeContext = `Analizza il seguente requisito software e il codice associato per verificare se il codice soddisfa il requisito. Rispondi esclusivamente con un file JSON nel seguente formato:
    {
      "quality_score": <0-100>,
      "issues": [
        "Issue 1",
        "Issue 2",
        ...
      ],
      "suggestions": [
        "Suggerimento 1",
        "Suggerimento 2",
        ...
      ]
    }

    Regole di valutazione:
    1. **Quality Score**:
      - 90-100: Codice eccellente, leggibile e completamente aderente al requisito.
      - 70-89: Codice buono, con alcuni miglioramenti possibili.
      - 50-69: Codice sufficiente, ma con problemi significativi.
      - <50: Codice insufficiente, non soddisfa il requisito o è di bassa qualità.
    2. **Issues**: Identifica errori, malfunzionamenti o discrepanze tra codice e requisito.
    3. **Suggestions**: Elenca i modi per migliorare il codice o risolvere problemi.`;
    const codePrompt = `REQUISITO: "${requirement}" \n CODICE: "${code}" `;

    const codeAnalysis = await ollamaService.sendMessageToOllama(codeModel, codePrompt, codeContext);
    
    //Parsing JSON
    try {
      requirementAnalysisObj = JSON.parse(requirementAnalysis.response || '{}');

    } catch (parseErr) {
      console.error('Error parsing requirementAnalysis JSON:', parseErr);
      requirementAnalysisObj = { parseError: true };
    }

    try {
      codeAnalysisObj = JSON.parse(codeAnalysis.response || '{}');

    } catch (parseErr) {
      console.error('Error parsing codeAnalysis JSON:', parseErr);
      codeAnalysisObj = { parseError: true };
    }

    //Valuta i parametri
    finalScore = codeAnalysisObj.quality_score;
    finalPassed = (requirementAnalysisObj.passed) && (finalScore>=80);

    if (!requirementAnalysisObj.passed) {
      finalIssues = [
        "Il requisito è ambiguo, poco chiaro o incompleto",
        ...codeIssues
      ];
    } else {
      finalIssues = codeAnalysisObj.issues;
    }

    finalSuggestions = [
      ...requirementAnalysisObj.suggestions,
      ...codeAnalysisObj.suggestions
    ];
    


    // Compone JSON di risposta:
      // {
      //   "id": "REQ-001",
      //   "passed": true, 
      //   "quality_score": 85,
      //   "issues": ["Manca il controllo su n negativo",
      //   "suggestions": ["Verificare n non negativo"]
      // }
      
    const finalAnalysis = {
      id,
      finalPassed,
      finalScore,
      finalIssues,         
      finalSuggestions
    };
    
    console.log('Valutazione finale:', finalAnalysis);

    //Manda risposta con il nuovo JSON
    res.status(200).json(finalAnalysis);
    
  } catch (error) {
    console.error('Error analyzing requirement:', error.message);
    res.status(500).json({ error: 'Failed to analyze requirement' });
  }
};

/*

curl -X POST http://localhost:3000/api/ollama/analyzeRequirement \
-H "Content-Type: application/json" \
-d '{
  "requirement": "La funzione deve calcolare i numeri di fibonacci"
}'

*/