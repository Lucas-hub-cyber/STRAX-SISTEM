# STRAX System

Backend y motor base del sistema central STRAX.

## Arranque

El backend STRAX corre por defecto en `http://localhost:3001`.

```bash
npm run start:strax
```

## Endpoints

- `GET /`
- `GET /health`
- `POST /evaluate`

La interfaz de usuario principal vive en `STRAX Landing` sobre `http://localhost:3000`.

## Probar health

PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/health"
```

## Probar /evaluate

PowerShell:

```powershell
$body = @'
{
  "strategy": {
    "clarity": "high",
    "focus": "focused",
    "value_proposition": "differentiated",
    "scalability": "scalable",
    "coherence": "aligned"
  },
  "governance": {
    "founder_dependency": "medium",
    "role_clarity": "clear",
    "decision_structure": "semi_structured",
    "accountability": "formal",
    "delegation": "partial"
  },
  "operations": {
    "process_definition": "defined",
    "replicability": "high",
    "bottlenecks": "controlled",
    "execution_time": "stable",
    "quality_control": "systematic"
  },
  "data": {
    "metrics_exist": "basic",
    "data_accuracy": "medium",
    "decision_based_on_data": "sometimes",
    "frequency_of_review": "monthly",
    "data_integration": "partial"
  },
  "technology": {
    "tools_stack": "semi_connected",
    "manual_dependency": "medium",
    "automation_level": "partial",
    "scalability": "limited",
    "system_reliability": "acceptable"
  },
  "founder": {
    "decision_discipline": "high",
    "delegation": "partial",
    "data_usage": "basic",
    "scaling_mindset": "developing",
    "architecture_acceptance": "aligned"
  },
  "economicInputs": {
    "revenue": 1000000,
    "hours": 400,
    "reworkRate": 0.12,
    "costPerHour": 25,
    "errorRate": 0.04,
    "decisionTimeLost": 80,
    "dataQualityLoss": 0.03,
    "techDowntime": 12,
    "costDowntimePerHour": 150
  }
}
'@

Invoke-RestMethod -Uri "http://localhost:3001/evaluate" -Method Post -ContentType "application/json" -Body $body
```

## Respuesta esperada

El endpoint devuelve:

```json
{
  "layers": {},
  "founder": 0,
  "IIA_base": 0,
  "structural_penalty": 0,
  "IIA": 0,
  "IRA_base": 0,
  "critical_penalty": 0,
  "founder_penalty": 0,
  "IRA": 0,
  "CR": 0,
  "CE": 0,
  "CGov": 0,
  "CD": 0,
  "CT": 0,
  "CEA": 0,
  "MIE_percent": 0
}
```
