# Interface: API REST de Conectores Sociais (LinkedIn & X)

> Identificador: `018-hupflow-linkedin-x-connectors`  
> Base Path: `/api/connectors`  

---

## 1. Listar Contas Conectadas
- **Método / Rota:** `GET /api/connectors/accounts`
- **Autenticação:** Requer papel `viewer` no workspace (`requireOrgRole(req, 'viewer')`).
- **Resposta (200 OK):**
```json
{
  "accounts": [
    {
      "id": "acc_1",
      "provider": "linkedin",
      "accountName": "Lucas Silva",
      "providerAccountId": "urn:li:person:123",
      "accountAvatar": "https://...",
      "connectedAt": "2026-10-16T12:00:00.000Z",
      "status": "active"
    }
  ],
  "quota": {
    "used": 1,
    "limit": 10,
    "canAddMore": true
  }
}
```

---

## 2. Conectar Conta (Simulada Dev ou OAuth)
- **Método / Rota:** `POST /api/connectors/accounts`
- **Autenticação:** Requer papel `member` ou superior (`requireOrgRole(req, 'member')`).
- **Validação de Cota:** Invoca `checkResourceQuota(plan, 'socialAccounts', currentUsage)`.
- **Payload:**
```json
{
  "provider": "linkedin", // "linkedin" | "x" | "instagram" | "threads"
  "code": "auth_code_ou_mock",
  "redirectUri": "https://..."
}
```
- **Resposta de Sucesso (201 Created):**
```json
{
  "success": true,
  "account": {
    "id": "acc_2",
    "provider": "x",
    "accountName": "@hupflow_tech",
    "status": "active"
  }
}
```
- **Erro de Cota Excedida (403 Forbidden):**
```json
{
  "error": "Você atingiu o limite de 3 contas sociais conectadas do plano Starter. Faça upgrade para continuar expandindo.",
  "code": "QUOTA_EXCEEDED"
}
```

---

## 3. Desconectar Conta
- **Método / Rota:** `DELETE /api/connectors/accounts?id=acc_1`
- **Autenticação:** Requer papel `admin` ou `owner` (`requireOrgRole(req, 'admin')`).
- **Resposta (200 OK):** `{ "success": true }`

---

## 4. Despachar Publicação de Teste
- **Método / Rota:** `POST /api/connectors/publish`
- **Autenticação:** Requer papel `member`.
- **Payload:**
```json
{
  "socialAccountId": "acc_1",
  "content": "Publicação de teste com carrossel nativo HupFlow #CleanRoom",
  "mediaUrls": ["https://storage.hupflow.com/carousels/export.pdf"],
  "documentTitle": "Guia de Arquitetura Limpa (Carrossel PDF)",
  "isThread": false
}
```
- **Resposta (200 OK):**
```json
{
  "success": true,
  "externalPostId": "urn:li:share:987654321",
  "externalPostUrl": "https://www.linkedin.com/feed/update/urn:li:share:987654321"
}
```
