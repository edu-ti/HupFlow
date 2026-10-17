# API Interfaces: 037-hupflow-campaign-ab-testing-hooks

## 1. `GET /api/ab-tests`
- **RBAC**: `requireOrgRole(req, 'viewer')`
- **Query Params**:
  - `status` (opcional): `running` | `completed` | `all`
- **Response `200 OK`**:
```json
{
  "experiments": [
    {
      "id": "ab_seed_1",
      "organizationId": "org_default",
      "title": "Capa Carrossel LinkedIn: Guia de IA para Agências",
      "channel": "linkedin",
      "testType": "carousel_cover",
      "hypothesisAngle": "social_proof_numbers",
      "targetMetric": "ctr_clicks",
      "minSampleSize": 300,
      "targetConfidencePct": 95,
      "status": "completed",
      "winningVariantId": "B",
      "variantA": {
        "id": "A",
        "label": "Controle (Direto)",
        "hookText": "Como usar IA para escalar sua agência de conteúdo em 2026",
        "impressions": 1450,
        "conversions": 68
      },
      "variantB": {
        "id": "B",
        "label": "Desafiante (Prova Social + Números)",
        "hookText": "Analisamos 412 agências: o sistema exato de IA que economiza 18h/semana",
        "impressions": 1480,
        "conversions": 114
      },
      "stats": {
        "rateAPct": 4.69,
        "rateBPct": 7.7,
        "relativeLiftPct": 64.18,
        "zScore": 3.38,
        "confidencePct": 99.9,
        "hasMinSample": true,
        "isStatisticallySignificant": true,
        "recommendedOutcome": "winner_b"
      }
    }
  ],
  "summary": {
    "totalExperiments": 3,
    "runningCount": 2,
    "completedCount": 1,
    "avgRelativeLiftPct": 41.2,
    "avgConfidencePct": 91.4
  }
}
```

## 2. `POST /api/ab-tests`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "title": "Hook Reels: Retenção nos 3 primeiros segundos",
  "channel": "instagram",
  "testType": "hook_copy",
  "hypothesisAngle": "contrarian_shock",
  "targetMetric": "engagement_rate",
  "hookTextA": "3 dicas práticas para melhorar o alcance dos seus Reels hoje",
  "hookTextB": ""
}
```
  - Se `hookTextB` for omitido ou vazio, o servidor gera automaticamente a Variante B usando `generateChallengerHookVariant`.

## 3. `POST /api/ab-tests/simulate`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "experimentId": "ab_seed_2",
  "action": "simulate_traffic"
}
```
  - Suporta `action: "simulate_traffic"` (adiciona lote de impressões/conversões e promove automaticamente se atingir significância), `action: "declare_winner"` (encerra e promove a líder) ou `action: "delete"`.
