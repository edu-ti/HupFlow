# Interfaces de API: Feature 023 - Chaves de API Públicas

> Identificador: `023-hupflow-public-api-keys`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Endpoints REST Administrativos

### 1.1 Listar Chaves de API do Workspace
`GET /api/api-keys`
- **Autenticação**: Requer sessão com `organizationId` (mínimo `admin`).
- **Resposta**:
  ```json
  {
    "apiKeys": [
      {
        "id": "key_01J...",
        "name": "CI/CD Content Pipeline",
        "keyPrefix": "hup_live_ab12cd...",
        "scopes": ["posts:write", "media:upload"],
        "isActive": true,
        "lastUsedAt": "2026-10-16T19:45:00Z",
        "createdAt": "2026-10-16T18:00:00Z"
      }
    ]
  }
  ```

### 1.2 Criar Nova Chave de API
`POST /api/api-keys`
- **Autenticação**: Requer `admin` ou `owner`.
- **Body**:
  ```json
  {
    "name": "Python Script Analytics",
    "scopes": ["analytics:read", "posts:read"],
    "expiresInDays": 90
  }
  ```
- **Resposta**: Retorna a chave completa **apenas nesta requisição**:
  ```json
  {
    "apiKey": {
      "id": "key_01J...",
      "name": "Python Script Analytics",
      "keyPrefix": "hup_live_4f8a9e...",
      "token": "hup_live_4f8a9e_e98213bc0192a3487192348a7b98c761",
      "scopes": ["analytics:read", "posts:read"],
      "createdAt": "2026-10-16T20:20:00Z"
    }
  }
  ```

### 1.3 Revogar Chave de API
`DELETE /api/api-keys?id=key_01J...`
- **Autenticação**: Requer `admin` ou `owner`.
- **Resposta**: `{ "success": true }`.

---

## 2. Autenticação Externa via cURL & SDKs

Todas as rotas públicas do HupFlow podem ser chamadas passando o cabeçalho `Authorization`:

```bash
curl -X GET "https://api.hupflow.com/api/analytics" \
  -H "Authorization: Bearer hup_live_4f8a9e_e98213bc0192a3487192348a7b98c761"
```
ou
```bash
curl -X POST "https://api.hupflow.com/api/posts" \
  -H "X-API-Key: hup_live_4f8a9e_e98213bc0192a3487192348a7b98c761" \
  -H "Content-Type: application/json" \
  -d '{"content": "Post publicado via CLI"}'
```
