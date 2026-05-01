const { analyzeBusiness } = require('../gpt/analyze');
const { mapInput } = require('../gpt/inputMapper');
const { evaluateStructure } = require('../engine/scoring');

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload, null, 2));
}

function parseAnalysis(rawAnalysis) {
  return JSON.parse(rawAnalysis);
}

function analyzeRoute(request, response) {
  let rawBody = '';

  request.on('data', (chunk) => {
    rawBody += chunk;
  });

  request.on('end', async () => {
    try {
      const parsedBody = rawBody ? JSON.parse(rawBody) : {};
      const text = parsedBody.text;

      if (!text || typeof text !== 'string') {
        sendJson(response, 400, {
          ok: false,
          error: 'Invalid payload',
          message: 'Send a JSON body with a non-empty text field.'
        });
        return;
      }

      const gptResult = await analyzeBusiness(text);
      const structured = parseAnalysis(gptResult);
      const result = evaluateStructure(mapInput(structured));

      sendJson(response, 200, {
        structured,
        result
      });
    } catch (error) {
      console.error(error);

      sendJson(response, 500, {
        error: 'Error analizando negocio'
      });
    }
  });
}

module.exports = {
  analyzeRoute,
  handleAnalyze: analyzeRoute
};
