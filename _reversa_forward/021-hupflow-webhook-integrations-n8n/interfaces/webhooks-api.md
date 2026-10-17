# Interfaces de API: Feature 021 - Webhooks Corporativos & Integrações n8n

> Identificador: `021-hupflow-webhook-integrations-n8n`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Endpoints REST

### 1.1 Listar Webhooks
`GET /api/webhooks`
- **Autenticação**: Requer sessão com `organizationId`.
- **Resposta**:
  ```json
  {
    "webhooks": [
      {
        "id": "wh_01J...",
        "name": "n8n Social Workflow",
        "url": "https://n8n.meudominio.com/webhook/hupflow-events",
        "events": ["post.published", "post.failed"],
        "isActive": true,
        "createdAt": "2026-10-16T19:00:00Z"
      }
    ]
  }
  ```

### 1.2 Criar Webhook
`POST /api/webhooks`
- **Body**:
  ```json
  {
    "name": "Zapier Alerts",
    "url": "https://hooks.zapier.com/hooks/catch/...",
    "events": ["post.failed", "campaign.completed"],
    "isActive": true
  }
  ```
- **Resposta**: Retorna o objeto criado incluindo o `secret` gerado (`whsec_...`).

### 1.3 Atualizar Webhook
`PUT /api/webhooks`
- **Body**:
  ```json
  {
    "id": "wh_01J...",
    "name": "Nome Atualizado",
    "url": "https://...",
    "events": ["post.published"],
    "isActive": false,
    "regenerateSecret": false
  }
  ```

### 1.4 Excluir Webhook
`DELETE /api/webhooks?id=wh_01J...`

### 1.5 Testar / Simular Disparo (Ping)
`POST /api/webhooks/test`
- **Body**:
  ```json
  {
    "id": "wh_01J...",
    "event": "post.published"
  }
  ```
- **Resposta**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "responseTimeMs": 142,
    "deliveryId": "del_01J..."
  }
  ```

### 1.6 Listar Histórico de Entregas
`GET /api/webhooks/deliveries?webhookId=wh_01J...`
- **Resposta**:
  ```json
  {
    "deliveries": [
      {
        "id": "del_01J...",
        "webhookId": "wh_01J...",
        "event": "post.published",
        "statusCode": 200,
        "responseTimeMs": 142,
        "createdAt": "2026-10-16T19:30:00Z"
      }
    ]
  }
  ```

---

## 2. Cabeçalhos HTTP Enviados no Despacho

| Header | Descrição | Exemplo |
|--------|-----------|---------|
| `Content-Type` | MIME type fixo | `application/json` |
| `User-Agent` | Identificação do cliente | `HupFlow-Webhooks/1.0` |
| `X-HupFlow-Signature` | Assinatura HMAC-SHA256 | `sha256=a1b2c3d4...` |
| `X-HupFlow-Timestamp` | Timestamp Unix em segundos | `1792180800` |
| `X-HupFlow-Event` | Tipo do evento | `post.published` |
| `X-HupFlow-Delivery` | ID único da tentativa | `del_01J...` |
