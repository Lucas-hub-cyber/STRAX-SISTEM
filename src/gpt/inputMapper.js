function normalizeSection(section) {
  if (!section || typeof section !== 'object' || Array.isArray(section)) {
    return {};
  }

  return section;
}

function mapInput(rawInput = {}) {
  return {
    strategy: normalizeSection(rawInput.strategy),
    governance: normalizeSection(rawInput.governance),
    operations: normalizeSection(rawInput.operations),
    data: normalizeSection(rawInput.data),
    technology: normalizeSection(rawInput.technology),
    founder: normalizeSection(rawInput.founder),
    economicInputs: {
      revenue: Number(rawInput.economicInputs?.revenue) || 0,
      hours: Number(rawInput.economicInputs?.hours) || 0,
      reworkRate: Number(rawInput.economicInputs?.reworkRate) || 0,
      costPerHour: Number(rawInput.economicInputs?.costPerHour) || 0,
      errorRate: Number(rawInput.economicInputs?.errorRate) || 0,
      decisionTimeLost: Number(rawInput.economicInputs?.decisionTimeLost) || 0,
      dataQualityLoss: Number(rawInput.economicInputs?.dataQualityLoss) || 0,
      techDowntime: Number(rawInput.economicInputs?.techDowntime) || 0,
      costDowntimePerHour: Number(rawInput.economicInputs?.costDowntimePerHour) || 0
    }
  };
}

module.exports = {
  mapInput
};
