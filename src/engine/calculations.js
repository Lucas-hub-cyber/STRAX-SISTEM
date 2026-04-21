function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeScore(value, scale) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return scale.min;
  }

  return clamp(numericValue, scale.min, scale.max);
}

function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function calculateAverage(values) {
  if (!values.length) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return round(total / values.length);
}

function resolveEnumScore(enumValue, scoreMap, scale) {
  const mappedValue = scoreMap[enumValue];
  if (mappedValue === undefined) {
    return scale.min;
  }

  return normalizeScore(mappedValue, scale);
}

function calculateLayerScore(layerKey, payload, rules) {
  const layerRule = rules.layers[layerKey];
  const subvariables = Object.entries(layerRule.subvariables).map(([name, scoreMap]) => {
    const selectedValue = payload?.[name];
    return {
      name,
      value: selectedValue ?? null,
      score: resolveEnumScore(selectedValue, scoreMap, rules.scale)
    };
  });
  const rawScore = calculateAverage(subvariables.map((item) => item.score));

  return {
    key: layerKey,
    code: layerRule.code,
    name: layerRule.name,
    score: rawScore,
    subvariables: subvariables.map((item) => ({
      name: item.name,
      value: item.value,
      score: round(item.score)
    }))
  };
}

function calculateFounderScore(payload, rules) {
  const subvariables = Object.entries(rules.founder.subvariables).map(([name, scoreMap]) => {
    const selectedValue = payload?.[name];
    return {
      name,
      value: selectedValue ?? null,
      score: resolveEnumScore(selectedValue, scoreMap, rules.scale)
    };
  });

  return {
    score: calculateAverage(subvariables.map((item) => item.score)),
    subvariables: subvariables.map((item) => ({
      name: item.name,
      value: item.value,
      score: round(item.score)
    }))
  };
}

function calculateIIABase(layers) {
  return calculateAverage(layers.map((layer) => layer.score));
}

function calculateStructuralPenalty(layers, theta = 35) {
  const minimumLayer = Math.min(...layers.map((layer) => layer.score));
  if (minimumLayer >= theta) {
    return 0;
  }

  return round(theta - minimumLayer);
}

function calculateIIA(iiaBase, structuralPenalty) {
  return round(clamp(iiaBase - structuralPenalty, 0, 100));
}

function calculateIRA(layerScores, founderScore) {
  const governance = layerScores.governance?.score || 0;
  const data = layerScores.data?.score || 0;
  const operations = layerScores.operations?.score || 0;
  const technology = layerScores.technology?.score || 0;

  const MC = 100 - governance;
  const DD = 100 - data;
  const CG = 100 - operations;
  const FT = 100 - technology;
  const IRA_base = calculateAverage([MC, DD, CG, FT]);
  const criticalRisks = [MC, DD, CG, FT].filter((risk) => risk > 70).length;
  const critical_penalty = round(criticalRisks * 7.5);
  const founder_penalty = round(Math.max(0, (100 - founderScore) * 0.2));
  const IRA = round(clamp(IRA_base + critical_penalty + founder_penalty, 0, 100));

  return {
    IRA_base,
    critical_penalty,
    founder_penalty,
    IRA
  };
}

function calculateCEA(economicInputs = {}) {
  const revenue = Math.max(Number(economicInputs.revenue) || 0, 0);
  const hours = Math.max(Number(economicInputs.hours) || 0, 0);
  const reworkRate = Math.max(Number(economicInputs.reworkRate) || 0, 0);
  const costPerHour = Math.max(Number(economicInputs.costPerHour) || 0, 0);
  const errorRate = Math.max(Number(economicInputs.errorRate) || 0, 0);
  const decisionTimeLost = Math.max(Number(economicInputs.decisionTimeLost) || 0, 0);
  const dataQualityLoss = Math.max(Number(economicInputs.dataQualityLoss) || 0, 0);
  const techDowntime = Math.max(Number(economicInputs.techDowntime) || 0, 0);
  const costDowntimePerHour = Math.max(Number(economicInputs.costDowntimePerHour) || 0, 0);

  const CR = round(hours * reworkRate * costPerHour);
  const CE = round(revenue * errorRate);
  const CGov = round(decisionTimeLost * costPerHour);
  const CD = round(revenue * dataQualityLoss);
  const CT = round(techDowntime * costDowntimePerHour);
  const CEA = round(CE + CR + CGov + CD + CT);
  const MIE_percent = revenue > 0 ? round(CEA / revenue) : 0;

  return {
    CR,
    CE,
    CGov,
    CD,
    CT,
    CEA,
    MIE_percent
  };
}

module.exports = {
  calculateCEA,
  calculateFounderScore,
  calculateIIA,
  calculateIIABase,
  calculateIRA,
  calculateLayerScore,
  calculateStructuralPenalty,
  normalizeScore,
  resolveEnumScore,
  round
};
