const ollamaService = require('../services/ollamaService');

exports.analyzeRequirement = async (req, res) => {
  try {
    const { requirement } = req.body;

    if (!requirement || typeof requirement !== 'string') {
      return res.status(400).json({ error: 'Requirement is required and must be a string' });
    }

    const prompt = `Fammi l'analisi di questo requisito: ${requirement}`;
    const model = 'llama3.2:1b';

    const response = await ollamaService.sendMessageToOllama(model, prompt);
    console.log('Ollama response:', response);
    
    res.status(200).json({ analysis: response.response });
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