# Especificação de Interface: API de Hashtags & Coleções Salvas

> Identificador: `028-hupflow-ai-hashtag-recommender`  
> Data: `2026-10-16`  

---

## 1. Endpoints de IA & Recomendação

### `POST /api/ai/hashtags`
Gera recomendações de hashtags ranqueadas a partir de texto, tema ou nicho.

- **Autenticação**: `requireOrgRole(req, 'viewer')`
- **Request Body**:
```json
{
  "text": "Construir consistência em mídias sociais...",
  "topic": "Estratégia de conteúdo SaaS",
  "network": "linkedin",
  "limit": 10
}
```
- **Response (200 OK)**:
```json
{
  "recommendations": [
    {
      "tag": "SaaS",
      "tier": "broad",
      "relevanceScore": 95,
      "estimatedReach": "high"
    },
    {
      "tag": "MarketingB2B",
      "tier": "niche",
      "relevanceScore": 88,
      "estimatedReach": "medium"
    },
    {
      "tag": "GestaoDeMidias",
      "tier": "community",
      "relevanceScore": 79,
      "estimatedReach": "targeted"
    }
  ],
  "networkGuidance": {
    "network": "linkedin",
    "recommendedCount": 5,
    "tip": "No LinkedIn, 3 a 5 hashtags focadas em tópicos corporativos geram a melhor indexação."
  }
}
```

---

## 2. Endpoints de Coleções Salvas (Hashtag Sets)

### `GET /api/hashtags/sets`
Lista todas as coleções salvas do workspace.

- **Autenticação**: `requireOrgRole(req, 'viewer')`
- **Response (200 OK)**:
```json
{
  "sets": [
    {
      "id": "hts_1729123456_abc",
      "organizationId": "org_default",
      "name": "SaaS & Tech Core",
      "category": "tech",
      "tags": ["SaaS", "Software", "B2B", "Startups", "Produtividade"],
      "usageCount": 14,
      "createdAt": "2026-10-16T20:00:00.000Z",
      "updatedAt": "2026-10-16T20:00:00.000Z"
    }
  ]
}
```

### `POST /api/hashtags/sets`
Cria ou atualiza uma coleção salva.

- **Autenticação**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "name": "Lançamento de Produto",
  "category": "marketing",
  "tags": ["Lancamento", "Novidades", "TechBrasil", "Inovacao"]
}
```

### `DELETE /api/hashtags/sets?id=hts_...`
Remove uma coleção salva.

- **Autenticação**: `requireOrgRole(req, 'member')`
