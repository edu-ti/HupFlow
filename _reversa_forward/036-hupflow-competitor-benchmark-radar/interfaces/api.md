# API Interfaces: 036-hupflow-competitor-benchmark-radar

## 1. `GET /api/competitors`
- **RBAC**: `requireOrgRole(req, 'viewer')`
- **Query Params**:
  - `channel` (opcional): filtra por rede social (`instagram`, `linkedin`, `tiktok`, `youtube`, `x`)
- **Response `200 OK`**:
```json
{
  "workspaceBaseline": {
    "name": "Sua Marca (HupFlow Workspace)",
    "handle": "@hupflow_oficial",
    "followersCount": 42500,
    "engagementRatePct": 4.8,
    "postsPerWeek": 6,
    "growth30dPct": 8.4,
    "coveredTopics": ["Automação Social", "Design de Carrosséis", "Produtividade Agência"],
    "shareOfVoicePct": 28.4
  },
  "competitors": [
    {
      "id": "comp_demo_1",
      "organizationId": "org_default",
      "name": "PulseSocial AI",
      "handle": "@pulsesocial.ai",
      "channel": "instagram",
      "niche": "SaaS & Marketing",
      "followersCount": 68000,
      "engagementRatePct": 5.2,
      "postsPerWeek": 7,
      "growth30dPct": 11.5,
      "topFormat": "reel_video",
      "topTopics": ["Ganchos Virais Reels", "IA para Copywriting", "Bastidores de Crescimento"],
      "threatScore": 84,
      "threatLevel": "critical",
      "shareOfVoicePct": 41.2,
      "weeklyEngagedReach": 24752
    }
  ],
  "comparison": {
    "nicheAvgEngagementPct": 4.35,
    "nicheAvgPostsPerWeek": 5.7,
    "nicheAvgGrowth30dPct": 7.9,
    "engagementDeltaPct": 0.45,
    "cadenceDeltaPosts": 0.3,
    "brandShareOfVoicePct": 28.4,
    "winningFormatInNiche": "reel_video"
  },
  "contentGaps": [
    {
      "id": "gap_1",
      "topic": "Ganchos Virais Reels",
      "competitorSource": "@pulsesocial.ai",
      "recommendedFormat": "reel_video",
      "opportunityScore": 92,
      "suggestedHook": "Por que 90% dos criadores erram nos primeiros 3 segundos de Ganchos Virais Reels (e como corrigir hoje):",
      "rationale": "Tópico com 5.2% de engajamento em @pulsesocial.ai ainda não abordado pelo seu workspace."
    }
  ]
}
```

## 2. `POST /api/competitors`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "name": "ScaleContent Studio",
  "handle": "@scalecontent",
  "channel": "linkedin",
  "niche": "B2B Growth",
  "followersCount": 31000,
  "engagementRatePct": 3.9,
  "postsPerWeek": 5,
  "growth30dPct": 6.2,
  "topFormat": "carousel",
  "topTopics": ["Funil Orgânico LinkedIn", "Social Selling B2B"]
}
```
- **Response `201 Created`**: Objeto `CompetitorProfile` enriquecido com `threatScore`, `threatLevel` e `weeklyEngagedReach`.

## 3. `POST /api/competitors/sync`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "competitorId": "comp_demo_1",
  "action": "sync"
}
```
  - Suporta `action: "sync"` (atualiza snapshot de métricas e recalcula threat score) ou `action: "delete"` (remove concorrente do radar).
