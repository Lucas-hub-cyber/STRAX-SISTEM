const { mapInput } = require('../gpt/inputMapper');
const { evaluateStructure } = require('../engine/scoring');

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload, null, 2));
}

function handleEvaluate(request, response) {
  let rawBody = '';

  request.on('data', (chunk) => {
    rawBody += chunk;
  });

  request.on('end', () => {
    try {
      const parsedBody = rawBody ? JSON.parse(rawBody) : {};
      const mappedInput = mapInput(parsedBody);
      const evaluation = evaluateStructure(mappedInput);

      sendJson(response, 200, {
        layers: evaluation.layers,
        founder: evaluation.founder,
        IIA_base: evaluation.IIA_base,
        structural_penalty: evaluation.structural_penalty,
        IIA: evaluation.IIA,
        IRA_base: evaluation.IRA_base,
        critical_penalty: evaluation.critical_penalty,
        founder_penalty: evaluation.founder_penalty,
        IRA: evaluation.IRA,
        CR: evaluation.CR,
        CE: evaluation.CE,
        CGov: evaluation.CGov,
        CD: evaluation.CD,
        CT: evaluation.CT,
        CEA: evaluation.CEA,
        MIE_percent: evaluation.MIE_percent
      });
    } catch (error) {
      sendJson(response, 400, {
        ok: false,
        error: 'Invalid JSON payload',
        message: error.message
      });
    }
  });
}

module.exports = {
  handleEvaluate
};
