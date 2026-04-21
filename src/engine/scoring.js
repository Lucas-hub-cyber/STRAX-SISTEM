const rules = require('./scoringRules.json');
const {
  calculateCEA,
  calculateFounderScore,
  calculateIIA,
  calculateIIABase,
  calculateIRA,
  calculateLayerScore,
  calculateStructuralPenalty
} = require('./calculations');

function evaluateStructure(input) {
  const layers = Object.fromEntries(
    Object.keys(rules.layers).map((layerKey) => [layerKey, calculateLayerScore(layerKey, input[layerKey], rules)])
  );
  const founder = calculateFounderScore(input.founder, rules);
  const layerList = Object.values(layers);
  const IIA_base = calculateIIABase(layerList);
  const structural_penalty = calculateStructuralPenalty(layerList, rules.theta);
  const IIA = calculateIIA(IIA_base, structural_penalty);
  const risk = calculateIRA(layers, founder.score);
  const economics = calculateCEA(input.economicInputs);

  return {
    layers: Object.fromEntries(
      Object.entries(layers).map(([key, layer]) => [key, layer.score])
    ),
    founder: founder.score,
    IIA_base,
    structural_penalty,
    IIA,
    IRA_base: risk.IRA_base,
    critical_penalty: risk.critical_penalty,
    founder_penalty: risk.founder_penalty,
    IRA: risk.IRA,
    CR: economics.CR,
    CE: economics.CE,
    CGov: economics.CGov,
    CD: economics.CD,
    CT: economics.CT,
    CEA: economics.CEA,
    MIE_percent: economics.MIE_percent
  };
}

module.exports = {
  evaluateStructure,
  rules
};
