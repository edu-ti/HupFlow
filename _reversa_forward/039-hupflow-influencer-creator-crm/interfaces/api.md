# API Interfaces: 039-hupflow-influencer-creator-crm

## 1. `GET /api/creators`
- **RBAC**: `requireOrgRole(req, 'viewer')`
- **Query Params**:
  - `stage` (opcional): `all` | `prospecting` | `negotiating` | `contracted` | `content_review` | `published`
- **Response `200 OK`**:
```json
{
  "creators": [
    {
      "id": "crt_seed_1",
      "organizationId": "org_default",
      "creatorName": "Bianca Tech & IA",
      "handle": "@bianca.ia",
      "channel": "instagram",
      "niche": "Produtividade & IA",
      "followersCount": 84000,
      "stage": "published",
      "agreedFeeBrl": 3200,
      "deliverablesTotal": 3,
      "deliverablesCompleted": 3,
      "totalViews": 92000,
      "totalEngagements": 6400,
      "generatedRevenueBrl": 9800,
      "couponCode": "BIANCA20",
      "metrics": {
        "cpeBrl": 0.5,
        "cpmBrl": 34.78,
        "emvBrl": 7096,
        "roiPct": 428,
        "performanceTier": "elite_roi"
      },
      "ugcBriefing": "Roteiro UGC @bianca.ia (Cupom: BIANCA20): [0-3s] Gancho visual mostrando rotina antes/depois..."
    }
  ],
  "summary": {
    "totalCreators": 3,
    "totalInvestedBrl": 8900,
    "totalValueGeneratedBrl": 34120,
    "portfolioRoiPct": 283.4,
    "avgCpeBrl": 0.68,
    "deliverablesProgressPct": 77.8
  }
}
```

## 2. `POST /api/creators`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "creatorName": "Diego SaaS Growth",
  "handle": "@diego.saas",
  "channel": "linkedin",
  "niche": "B2B & Marketing",
  "followersCount": 42000,
  "agreedFeeBrl": 2800,
  "deliverablesTotal": 2,
  "couponCode": "DIEGO15"
}
```
- **Response `201 Created`**: Objeto `CreatorPartnershipItem` com métricas financeiras e briefing UGC.

## 3. `POST /api/creators/action`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "creatorId": "crt_seed_2",
  "action": "log_deliverable"
}
```
  - Suporta `action: "log_deliverable"` (incrementa entregável concluído + visualizações, engajamentos e receita atribuída), `action: "advance_stage"` ou `action: "delete"`.
