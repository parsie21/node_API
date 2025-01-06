const ollamaService = require('../services/ollamaService');
const constants = require('../helpers/constants.js')

exports.analyzeRequirement = async (req, res) => {
  try {
    console.log("ollamaController.analyzeRequirement");

    // input 
    const { id, requirement, code } = req.body;

    // controllo 
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID is required and must be a string' });
    }
    else if (!requirement || typeof requirement !== 'string') {
      return res.status(400).json({ error: 'Requirement is required and must be a string' });
    }
    else if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required and must be a string' });
    }


    console.log("Pre Prompt Requirement");

    //Analisi semantica requisito
    const requirementModel = constants.requirementModel;
    const requirementContext = constants.requirementContext

    const requirementAnalysis = await ollamaService.sendMessageToOllama(requirementModel, requirement, requirementContext);
    console.log("Risposta 1:"+requirementAnalysis.response);

    //Parsing JSON
    try {
      requirementAnalysisObj = JSON.parse(requirementAnalysis.response || '{}');

    } catch (parseErr) {
      console.error('Error parsing requirementAnalysis JSON:', parseErr);
      requirementAnalysisObj = { parseError: true };
    }


    //Analisi del codice
    const codeModel = constants.codeModel;
    const codeContext = constants.codeContext;
    const codePrompt = constants.codePrompt;

    const codeAnalysis = await ollamaService.sendMessageToOllama(codeModel, codePrompt, codeContext);
    console.log("Risposta 2:"+codeAnalysis.response);

    //Parsing JSON
    try {
      codeAnalysisObj = JSON.parse(codeAnalysis.response || '{}');

    } catch (parseErr) {
      console.error('Error parsing codeAnalysis JSON:', parseErr);
      codeAnalysisObj = { parseError: true };
    }
  
    //Valuta i parametri
    finalScore = codeAnalysisObj?.quality_score || 0;
    requirementPassed = requirementAnalysisObj?.passed || false;
    finalPassed = (requirementPassed) && (finalScore>=80);

    finalIssues = []
    codeIssues = codeAnalysisObj?.issues || [];
    if (!requirementPassed) {
      finalIssues = [
        "Il requisito è ambiguo, poco chiaro o incompleto",
        ...codeIssues
      ];
    } else {
      finalIssues = codeIssues;
    }

    requirementSuggestions = requirementAnalysisObj?.suggestions || [];
    codeSuggestions = codeAnalysisObj?.suggestions || [];
    finalSuggestions = [
      ...requirementSuggestions,
      ...codeSuggestions
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