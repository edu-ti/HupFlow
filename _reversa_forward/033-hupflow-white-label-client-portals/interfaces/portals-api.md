# Interface de API: White-Label Client Portals & External Approvals

## 1. Endpoints do Dashboard (Autenticados via Workspace)

### `GET /api/portals`
Retorna a lista de portais white-label do workspace e estatísticas agregadas (total de portais, itens aprovados, pendentes e taxa de aprovação).

### `POST /api/portals`
Cria ou atualiza um portal white-label de cliente, suas entregas (`deliverables`) ou regenera o `token` mágico.

**Corpo da Requisição:**
```json
{
  "id": "portal_001",
  "clientName": "Acme Corp Brasil",
  "projectTitle": "Cronograma de Outubro — LinkedIn & Instagram",
  "brandColor": "#6366F1",
  "welcomeMessage": "Olá time Acme! Confira abaixo os carrosséis e posts da semana para aprovação.",
  "accessPin": "2026",
  "hideHupflowBranding": true,
  "isActive": true,
  "deliverables": [
    {
      "id": "deliv_1",
      "title": "Carrossel: 5 Tendências de IA para Varejo",
      "caption": "Confira como o varejo está aplicando agentes autônomos em 2026...",
      "channel": "linkedin",
      "scheduledDate": "2026-10-20T14:00:00Z",
      "mediaType": "carousel",
      "slideCount": 7,
      "status": "pending_review"
    }
  ]
}
```

### `DELETE /api/portals?id=portal_001`
Remove um portal do workspace.

---

## 2. Endpoints Públicos para o Cliente Externo (Magic-Link)

### `GET /api/portals/public/[token]`
Consulta os metadados públicos White-Label e as entregas do portal associado ao `token`.
Se `accessPin` estiver definido, valida o query param `?pin=...` ou retorna `{ requiresPin: true }`.

### `POST /api/portals/review`
Registra a decisão do cliente externo (`approved` ou `changes_requested`) sobre uma entrega específica (`deliverableId`).

**Corpo da Requisição:**
```json
{
  "token": "ptl_9f8a7b6c5d4e3f2a1b",
  "deliverableId": "deliv_1",
  "decision": "approved",
  "reviewerName": "Mariana Diretora de Mkt",
  "feedbackNote": "Excelente copy e capa! Aprovado para terça-feira.",
  "pin": "2026"
}
```
