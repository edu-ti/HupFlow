# Interface REST: Central de Notificações

> Identificador: `026-hupflow-notification-center`  
> Data: `2026-10-16`  

---

## 1. Endpoints

### `GET /api/notifications`
Lista as notificações do usuário logado na organização ativa e retorna o total de não lidas.

- **Autenticação**: Requer qualquer usuário autenticado (`requireOrgRole(req, 'viewer')`).
- **Query Parameters**:
  - `unreadOnly` (opcional): `true` para filtrar apenas não lidas.
  - `limit` (opcional, padrão 20, máx 100).
- **Resposta HTTP 200**:
```json
{
  "notifications": [
    {
      "id": "notif_1729114000_abc123",
      "type": "approval_requested",
      "title": "Post aguardando sua revisão",
      "message": "Eduardo submeteu 'Carrossel Tendências 2027' para aprovação.",
      "linkUrl": "/approvals",
      "entityType": "post",
      "entityId": "post_789",
      "isRead": false,
      "readAt": null,
      "createdAt": "2026-10-16T20:45:00.000Z"
    }
  ],
  "unreadCount": 1
}
```

### `PATCH /api/notifications`
Marca uma notificação específica como lida ou marca todas como lidas.

- **Corpo da Requisição (individual)**:
```json
{
  "notificationId": "notif_1729114000_abc123"
}
```
- **Corpo da Requisição (em lote)**:
```json
{
  "markAllAsRead": true
}
```
- **Resposta HTTP 200**:
```json
{
  "success": true,
  "updatedCount": 1
}
```
