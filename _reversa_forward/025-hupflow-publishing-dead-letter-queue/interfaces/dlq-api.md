# Interface REST: Dead-Letter Queue & Reprocessamento

> Identificador: `025-hupflow-publishing-dead-letter-queue`  
> Data: `2026-10-16`  

---

## 1. Endpoints

### `GET /api/posts/dlq`
Lista os incidentes da Dead-Letter Queue com dados combinados do post e canais.

- **Autenticação**: Requer papel `member` ou superior (`requireOrgRole(req, 'member')`).
- **Query Parameters**:
  - `status` (opcional): `pending` (padrão), `retrying`, `resolved`, `dismissed`, `all`.
  - `provider` (opcional): `instagram`, `threads`, `linkedin`, `x`.
- **Resposta HTTP 200**:
```json
{
  "incidents": [
    {
      "id": "dlq_1729113000_abc123",
      "postId": "post_789",
      "channelId": "chan_456",
      "provider": "instagram",
      "accountName": "@minhaempresa",
      "postContent": "Novidades incríveis no ar! 🚀",
      "errorCategory": "AUTH_EXPIRED",
      "rawErrorMessage": "Error validating access token: Session has expired",
      "recommendedAction": "Reconecte a conta do Instagram em Contas Conectadas para renovar a permissão.",
      "retryCount": 0,
      "lastRetryAt": null,
      "status": "pending",
      "createdAt": "2026-10-16T20:30:00.000Z"
    }
  ],
  "counts": {
    "pending": 3,
    "retrying": 0,
    "resolved": 12,
    "dismissed": 2
  }
}
```

### `POST /api/posts/dlq/retry`
Aciona o reprocessamento imediato de um incidente da DLQ ou de todos os canais pendentes de um post.

- **Corpo da Requisição**:
```json
{
  "incidentId": "dlq_1729113000_abc123",
  "updatedContent": "Texto corrigido opcional..."
}
```
- **Resposta HTTP 200**:
```json
{
  "success": true,
  "incidentId": "dlq_1729113000_abc123",
  "status": "retrying",
  "message": "Incidente reenfileirado para despacho com sucesso."
}
```

### `POST /api/posts/dlq/dismiss`
Descarta um incidente da fila.
- **Corpo da Requisição**: `{ "incidentId": "dlq_1729113000_abc123" }`
- **Resposta HTTP 200**: `{ "success": true, "status": "dismissed" }`
