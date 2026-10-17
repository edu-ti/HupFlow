# API Interfaces: 040-hupflow-employee-advocacy-board

## 1. `GET /api/advocacy`
- **RBAC**: `requireOrgRole(req, 'viewer')`
- **Query Params**:
  - `channel` (opcional): `all` | `linkedin` | `instagram` | `x`
- **Response `200 OK`**:
```json
{
  "campaigns": [
    {
      "id": "adv_seed_1",
      "organizationId": "org_default",
      "title": "Lançamento: Estúdio de Carrosséis PDF + Portais White-Label",
      "department": "Produto & Growth",
      "channel": "linkedin",
      "baseMessage": "Acabamos de liberar os novos Portais White-Label de aprovação em 1 clique no HupFlow Studio.",
      "targetUrl": "https://hupflow.app/lancamento-portais?utm_source=advocacy",
      "pointsReward": 75,
      "sharesCount": 14,
      "avgReachPerShare": 2200,
      "personaVariations": [
        {
          "persona": "executive_vision",
          "label": "Visão Executiva / Liderança",
          "copyText": "Na nossa jornada construindo o HupFlow, percebemos que agências perdiam horas cobrando aprovação no WhatsApp..."
        }
      ],
      "impact": {
        "totalOrganicReach": 30800,
        "estimatedClicks": 986,
        "adSpendSavedBrl": 7579
      },
      "isActive": true
    }
  ],
  "leaderboard": [
    {
      "id": "emp_1",
      "memberName": "Helena Costa",
      "roleTitle": "Head de Produto",
      "sharesCount": 18,
      "points": 1350,
      "organicReachGenerated": 39600,
      "badge": "Diamond Ambassador"
    }
  ],
  "summary": {
    "totalCampaigns": 3,
    "totalShares": 33,
    "totalOrganicReach": 67400,
    "totalAdSpendSavedBrl": 16140,
    "activeAmbassadors": 4
  }
}
```

## 2. `POST /api/advocacy`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "title": "Vagas Abertas: Time de Engenharia Clean-Room",
  "department": "Pessoas & Cultura",
  "channel": "linkedin",
  "baseMessage": "Estamos expandindo nosso time de engenharia TypeScript e IA no HupFlow.",
  "targetUrl": "https://hupflow.app/carreiras",
  "pointsReward": 60
}
```
- **Response `201 Created`**: Objeto `AdvocacyCampaignItem` com as 3 variações de persona geradas automaticamente.

## 3. `POST /api/advocacy/share`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "campaignId": "adv_seed_1",
  "action": "record_share",
  "memberName": "Eduardo (Você)"
}
```
  - Suporta `action: "record_share"` (incrementa compartilhamentos, recalcula economia em Ads e adiciona pontos ao colaborador no Leaderboard) ou `action: "delete"`.
