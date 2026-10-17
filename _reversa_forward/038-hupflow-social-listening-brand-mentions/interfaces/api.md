# API Interfaces: 038-hupflow-social-listening-brand-mentions

## 1. `GET /api/listening`
- **RBAC**: `requireOrgRole(req, 'viewer')`
- **Query Params**:
  - `category` (opcional): `all` | `brand_mention` | `competitor_complaint` | `industry_trend` | `crisis_risk`
- **Response `200 OK`**:
```json
{
  "mentions": [
    {
      "id": "lst_seed_crisis",
      "organizationId": "org_default",
      "keywordMatched": "API Meta Instabilidade",
      "channel": "x",
      "category": "crisis_risk",
      "authorName": "Lucas DevOps",
      "authorHandle": "@lucas_cloud",
      "authorFollowers": 42000,
      "content": "Alguém mais tendo erro 500 na API da Meta hoje? Nossos agendamentos travaram em várias ferramentas!",
      "sentiment": "negative",
      "sentimentScore": -72,
      "velocityPerHour": 85,
      "urgencyScore": 88,
      "crisisLevel": "critical_crisis",
      "status": "open",
      "playbook": {
        "strategyLabel": "Contenção Proativa & Transparência",
        "recommendedAction": "Responder em até 15 min destacando que a fila DLQ do HupFlow protege os posts automaticamente.",
        "suggestedPublicReply": "Olá @lucas_cloud! Identificamos essa oscilação global na Graph API da Meta. No HupFlow nossa fila DLQ já isolou os envios com retry automático sem perda de posts. Se precisar de apoio, conte com a gente!"
      }
    }
  ],
  "radar": {
    "totalMentions": 4,
    "netSentimentScore": 25,
    "criticalCrisisCount": 1,
    "competitorLeadOpportunities": 1,
    "crisisAlertActive": true,
    "topTrendingKeyword": "Carrossel PDF LinkedIn"
  }
}
```

## 2. `POST /api/listening`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "keywordMatched": "Alternativa ao Postiz",
  "channel": "reddit",
  "category": "competitor_complaint",
  "authorName": "Marina Growth",
  "authorHandle": "@marina_b2b",
  "authorFollowers": 12500,
  "velocityPerHour": 32,
  "content": "Estou procurando uma alternativa limpa ao Postiz que tenha aprovação white-label para clientes e estúdio de carrossel integrado."
}
```
- **Response `201 Created`**: Objeto `ListeningMentionItem` enriquecido com sentimento, `urgencyScore`, `crisisLevel` e `playbook`.

## 3. `POST /api/listening/action`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "mentionId": "lst_seed_crisis",
  "action": "engage"
}
```
  - Suporta `action: "engage"` (`status = 'engaged'`), `action: "resolve"` (`status = 'resolved'`), `action: "ignore"` (`status = 'ignored'`) ou `action: "delete"`.
