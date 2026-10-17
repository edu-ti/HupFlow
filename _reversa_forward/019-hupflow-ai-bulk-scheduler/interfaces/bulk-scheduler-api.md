# Interface: API REST de Campanhas em Lote com IA (AI Bulk Scheduler)

> Identificador: `019-hupflow-ai-bulk-scheduler`  
> Base Path: `/api/ai/bulk-campaign`  

---

## 1. Gerar & Agendar Campanha em Lote
- **Método / Rota:** `POST /api/ai/bulk-campaign`
- **Autenticação:** Requer papel `member`, `admin` ou `owner` (`requireOrgRole(req, 'member')`).
- **Validação de Cota:** Valida `checkResourceQuota(plan, 'postsThisMonth', currentUsage + postCount)`.

### Payload de Requisição
```json
{
  "mode": "preview", // "preview" (apenas gera e retorna) ou "commit" (persiste no banco de dados)
  "theme": "Lançamento da Arquitetura Clean-Room e Carrosséis",
  "targetAudience": "Criadores e Agências B2B",
  "postCount": 4,
  "daysOfWeek": [2, 4], // 2 = Terça, 4 = Quinta
  "timeSlot": "10:00",
  "startDate": "2026-10-20T00:00:00.000Z",
  "channels": ["acc_1", "acc_2"],
  "includeCarousels": true
}
```

### Resposta de Sucesso (200 OK)
```json
{
  "success": true,
  "mode": "preview",
  "campaignTheme": "Lançamento da Arquitetura Clean-Room e Carrosséis",
  "posts": [
    {
      "index": 1,
      "scheduledAt": "2026-10-20T10:00:00.000Z",
      "dayOfWeekName": "Terça-feira",
      "angle": "Diagnóstico do Problema",
      "headline": "O Grande Gargalo do Conteúdo B2B",
      "content": "Copy do post formatada...",
      "hashtags": ["#HupFlow", "#B2B", "#LinkedIn"],
      "isCarousel": true,
      "slideCount": 5,
      "postId": null // preenchido quando mode === "commit"
    }
  ],
  "quota": {
    "usedBefore": 14,
    "added": 4,
    "totalAfter": 18,
    "limit": 30
  }
}
```

### Resposta de Erro de Cota Excedida (403 Forbidden)
```json
{
  "error": "A criação de 8 posts excede a cota disponível do plano Starter (limite de 30 posts por mês).",
  "code": "QUOTA_EXCEEDED",
  "remaining": 2
}
```
