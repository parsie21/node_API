const ollamaService = require('../services/ollamaService');
const constants = require('../helpers/constants.js');

exports.analyzeRequirements = async (req, res) => {
  try {
    console.log("ollamaController.analyzeRequirements");

    // Input: Array di requisiti
    const { requirements } = req.body;

    // Validazione: Controlla che requirements sia un array
    if (!Array.isArray(requirements)) {
      return res.status(400).json({ error: 'Requirements must be an array' });
    }

    const results = []; // Array per aggregare i risultati finali

    for (const requirementObj of requirements) {
      const { id, requirement, code } = requirementObj;

      // Validazione di ogni requisito
      if (!id || typeof id !== 'string' || !requirement || typeof requirement !== 'string' || !code || typeof code !== 'string') {
        console.log(`Skipping invalid requirement: ${JSON.stringify(requirementObj)}`);
        results.push({
          id: id || 'UNKNOWN',
          finalPassed: false,
          finalScore: 0,
          finalIssues: ['Invalid input format'],
          finalSuggestions: []
        });
        continue; // Salta al prossimo requisito
      }

      console.log(`Processing requirement ID: ${id}`);

      // Analisi semantica requisito
      const requirementModel = constants.requirementModel;
      const requirementContext = constants.requirementContext;

      let requirementAnalysisObj;
      try {
        const requirementAnalysis = await ollamaService.sendMessageToOllama(requirementModel, requirement, requirementContext);
        requirementAnalysisObj = JSON.parse(requirementAnalysis.response || '{}');
      } catch (err) {
        console.error(`Error analyzing requirement ID ${id}:`, err.message);
        requirementAnalysisObj = { passed: false, suggestions: ["Error analyzing requirement"], parseError: true };
      }

      // Analisi del codice
      const codeModel = constants.codeModel;
      const codeContext = constants.codeContext;
      const codePrompt = constants.codePrompt;

      let codeAnalysisObj;
      try {
        const codeAnalysis = await ollamaService.sendMessageToOllama(codeModel, codePrompt, codeContext);
        codeAnalysisObj = JSON.parse(codeAnalysis.response || '{}');
      } catch (err) {
        console.error(`Error analyzing code for ID ${id}:`, err.message);
        codeAnalysisObj = { quality_score: 0, issues: ["Error analyzing code"], suggestions: [] };
      }

      // Valutazione finale
      const finalScore = codeAnalysisObj?.quality_score || 0;
      const requirementPassed = requirementAnalysisObj?.passed || false;
      const finalPassed = requirementPassed && finalScore >= 80;

      const finalIssues = requirementPassed
        ? codeAnalysisObj?.issues || []
        : ["Il requisito è ambiguo, poco chiaro o incompleto", ...(codeAnalysisObj?.issues || [])];

      const finalSuggestions = [
        ...(requirementAnalysisObj?.suggestions || []),
        ...(codeAnalysisObj?.suggestions || [])
      ];

      // Aggrega risultato per il requisito corrente
      results.push({
        id,
        finalPassed,
        finalScore,
        finalIssues,
        finalSuggestions
      });
    }

    // Risultato aggregato
    console.log('Final results:', results);
    res.status(200).json({ results });

  } catch (error) {
    console.error('Error analyzing requirements:', error.message);
    res.status(500).json({ error: 'Failed to analyze requirements' });
  }
};
