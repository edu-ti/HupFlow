# Interface REST: Trilha de Auditoria do Workspace

> Identificador: `024-hupflow-workspace-audit-logs`  
> Data: `2026-10-16`  

---

## 1. Endpoints

### `GET /api/audit-logs`
Consulta a trilha de eventos de auditoria da organização com múltiplos filtros e paginação.

- **Autenticação**: Requer papel `admin` ou `owner` (`requireOrgRole(req, 'admin')`).
- **Query Parameters**:
  - `category` (opcional): `all`, `security`, `content`, `team`, `connectors`, `integrations`.
  - `action` (opcional): string exata da ação.
  - `search` (opcional): busca por texto em ator ou detalhes.
  - `days` (opcional): `1`, `7`, `30`, `90` ou vazio para sem limite.
  - `limit` (opcional, padrão 50, máx 200).
  - `offset` (opcional, padrão 0).

- **Resposta HTTP 200**:
```json
{
  "logs": [
    {
      "id": "aud_1729112000_a1b2c3",
      "organizationId": "org_alpha",
      "actorId": "usr_123",
      "actorName": "Eduardo Silva",
      "actorEmail": "eduardo@empresa.com",
      "action": "api_key.created",
      "category": "security",
      "entityType": "api_key",
      "entityId": "apk_987",
      "details": { "name": "CI/CD Deploy", "scopes": ["posts:write"] },
      "ipAddress": "177.136.24.10",
      "createdAt": "2026-10-16T20:25:00.000Z"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

### `POST /api/audit-logs` (Uso Interno de Serviços)
Permite registro programático de eventos por microsserviços do backend.
