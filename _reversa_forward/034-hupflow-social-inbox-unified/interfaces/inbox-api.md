# Interface de API: Unified Social Inbox & AI Smart Replies

## 1. Endpoints do Dashboard (Autenticados via Workspace)

### `GET /api/inbox`
Lista as mensagens e interações sociais unificadas do workspace (com filtros opcionais `?status=unread&channel=linkedin&intent=lead_intent`), além de métricas agregadas (`unreadCount`, `leadIntentCount`, `repliedCount`, `responseRate`).

### `POST /api/inbox`
Ingere ou simula uma nova interação/comentário social no workspace, executando automaticamente o classificador `classifyInboxMessage`.

**Corpo da Requisição:**
```json
{
  "channel": "linkedin",
  "interactionType": "comment",
  "authorName": "Ricardo Mendes",
  "authorHandle": "@ricardomendes",
  "postTitle": "Carrossel: 7 Automações B2B com IA",
  "content": "Sensacional esse carrossel! Qual o valor do plano Agency para 15 clientes?"
}
```

### `POST /api/inbox/reply`
Envia uma resposta para a interação selecionada ou altera seu status (`replied`, `archived`, `unread`).

**Corpo da Requisição:**
```json
{
  "messageId": "msg_001",
  "action": "reply",
  "replyText": "Olá Ricardo! Obrigado pelo feedback. O plano Agency cobre múltiplos clientes com portais White-Label..."
}
```
