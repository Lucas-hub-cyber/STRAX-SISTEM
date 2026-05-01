const OpenAI = require('openai');

const MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

function requireApiKey() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required to analyze business text.');
  }
}

function buildStraxJsonPrompt(text) {
  return `
Convierte esta conversacion empresarial en un JSON STRAX.

IMPORTANTE:
- responde SOLO JSON valido
- no expliques nada
- usa exactamente las llaves y valores permitidos del esquema
- si el texto no menciona una variable, elige el valor mas conservador segun el contexto

Formato esperado:

{
  "strategy": {
    "clarity": "low|medium|high",
    "focus": "diversified|semi_focused|focused",
    "value_proposition": "unclear|generic|differentiated",
    "scalability": "none|limited|scalable",
    "coherence": "contradictory|partial|aligned"
  },
  "governance": {
    "founder_dependency": "high|medium|low",
    "role_clarity": "unclear|partial|clear",
    "decision_structure": "centralized|semi_structured|distributed",
    "accountability": "none|informal|formal",
    "delegation": "none|partial|structured"
  },
  "operations": {
    "process_definition": "none|partial|defined",
    "replicability": "none|low|high",
    "bottlenecks": "constant|frequent|controlled",
    "execution_time": "unpredictable|variable|stable",
    "quality_control": "none|manual|systematic"
  },
  "data": {
    "metrics_exist": "none|basic|structured",
    "data_accuracy": "low|medium|high",
    "decision_based_on_data": "never|sometimes|always",
    "frequency_of_review": "never|monthly|weekly",
    "data_integration": "none|partial|integrated"
  },
  "technology": {
    "tools_stack": "disconnected|semi_connected|integrated",
    "manual_dependency": "high|medium|low",
    "automation_level": "none|partial|advanced",
    "scalability": "none|limited|high",
    "system_reliability": "unstable|acceptable|robust"
  },
  "founder": {
    "decision_discipline": "low|medium|high",
    "delegation": "none|partial|structured",
    "data_usage": "none|basic|advanced",
    "scaling_mindset": "absent|developing|clear",
    "architecture_acceptance": "resistant|neutral|aligned"
  }
}

Texto:
${text}
`;
}

async function analyzeBusiness(text) {
  requireApiKey();

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.responses.create({
    model: MODEL,
    input: buildStraxJsonPrompt(text),
    reasoning: {
      effort: 'minimal'
    },
    text: {
      verbosity: 'low'
    },
    max_output_tokens: 1200
  });

  return response.output_text;
}

module.exports = {
  analyzeBusiness,
  buildStraxJsonPrompt
};
