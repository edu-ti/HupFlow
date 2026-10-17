# Interface: API REST de Analytics & Métricas

> Identificador: `016-hupflow-analytics-metrics`  
> Protocolo: HTTP REST / JSON  
> Base Path: `/api/analytics`  

---

## 1. Consultar Métricas Consolidadas

### Requisição
- **Método / Rota:** `GET /api/analytics`
- **Query Parameters:**
  - `range`: `7d` | `30d` | `90d` (padrão: `30d`)
  - `provider`: `all` | `instagram` | `threads` | `linkedin` | `x` (padrão: `all`)
- **Autenticação:** Requer sessão ativa (`requireOrgRole(req, 'viewer')`).

### Resposta de Sucesso (200 OK)
```json
{
  "period": "30d",
  "provider": "all",
  "kpis": {
    "totalImpressions": 48250,
    "totalReach": 32180,
    "totalEngagements": 2140,
    "averageEngagementRate": 6.65,
    "impressionsTrend": "+14.2%",
    "reachTrend": "+9.8%",
    "engagementsTrend": "+18.5%",
    "rateTrend": "+1.2%"
  },
  "dailySeries": [
    {
      "date": "2026-10-01",
      "impressions": 1420,
      "reach": 980,
      "engagements": 74
    }
  ],
  "channelBreakdown": [
    {
      "provider": "instagram",
      "name": "Instagram",
      "totalPosts": 14,
      "totalReach": 18200,
      "engagementRate": 7.2,
      "percentage": 56.5
    },
    {
      "provider": "linkedin",
      "name": "LinkedIn",
      "totalPosts": 8,
      "totalReach": 8900,
      "engagementRate": 5.8,
      "percentage": 27.6
    }
  ],
  "topPosts": [
    {
      "id": "post_101",
      "content": "Como escalar a produção de carrosséis sem perder qualidade...",
      "provider": "instagram",
      "publishedAt": "2026-10-12T14:30:00Z",
      "impressions": 4250,
      "reach": 3100,
      "likes": 280,
      "comments": 45,
      "shares": 32,
      "engagementRate": 11.51
    }
  ]
}
```

---

## 2. Códigos de Erro

- `401 Unauthorized`: Sessão inexistente ou expirada.
- `403 Forbidden`: Usuário não vinculado ao workspace.
- `500 Internal Server Error`: Falha de banco de dados.
