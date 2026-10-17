# Interface: API REST de Membros, Convites & RBAC

> Identificador: `015-hupflow-team-members-rbac`  
> Protocolo: HTTP REST / JSON  
> Base Path: `/api/org`  

---

## 1. Endpoints de Membros

### 1.1 Listar Membros da Organização
- **Método / Rota:** `GET /api/org/members`
- **Autenticação:** Requer sessão ativa (`getAuthContext`).
- **Permissão Mínima:** `viewer` (qualquer membro da organização pode visualizar a equipe).
- **Resposta Sucesso (200 OK):**
```json
{
  "members": [
    {
      "id": "mem_123",
      "userId": "usr_456",
      "name": "Eduardo",
      "email": "eduardo@hupflow.com",
      "image": null,
      "role": "owner",
      "joinedAt": "2026-10-15T17:30:00.000Z"
    }
  ],
  "currentUserRole": "owner"
}
```

### 1.2 Atualizar Papel de um Membro
- **Método / Rota:** `PATCH /api/org/members/[id]`
- **Autenticação:** Requer sessão ativa.
- **Permissão Mínima:** `admin` ou `owner`.
- **Payload:**
```json
{
  "role": "admin" // admin | member | viewer
}
```
- **Regras:**
  - `owner` só pode ser alterado por ele mesmo ao transferir a titularidade.
  - Usuário não pode rebaixar a si próprio se for o único `owner`.

### 1.3 Remover Membro da Organização
- **Método / Rota:** `DELETE /api/org/members/[id]`
- **Autenticação:** Requer sessão ativa.
- **Permissão Mínima:** `admin` ou `owner`.
- **Regras:**
  - Proibido remover o `owner` da organização (HTTP 400).
  - Proibido auto-remoção via este endpoint (use rota de saída voluntária se aplicável).

---

## 2. Endpoints de Convites

### 2.1 Listar Convites Pendentes
- **Método / Rota:** `GET /api/org/invitations`
- **Permissão Mínima:** `admin` ou `owner`.
- **Resposta Sucesso (200 OK):**
```json
{
  "invitations": [
    {
      "id": "inv_789",
      "email": "colaborador@empresa.com",
      "role": "member",
      "status": "pending",
      "expiresAt": "2026-10-23T15:00:00.000Z",
      "createdAt": "2026-10-16T15:00:00.000Z"
    }
  ]
}
```

### 2.2 Criar Novo Convite
- **Método / Rota:** `POST /api/org/invitations`
- **Permissão Mínima:** `admin` ou `owner`.
- **Payload:**
```json
{
  "email": "colaborador@empresa.com",
  "role": "member" // admin | member | viewer
}
```
- **Resposta Sucesso (201 Created):**
```json
{
  "invitation": {
    "id": "inv_789",
    "email": "colaborador@empresa.com",
    "role": "member",
    "status": "pending",
    "expiresAt": "2026-10-23T15:00:00.000Z",
    "inviteLink": "/accept-invite?token=inv_789"
  }
}
```

### 2.3 Revogar Convite
- **Método / Rota:** `DELETE /api/org/invitations/[id]`
- **Permissão Mínima:** `admin` ou `owner`.

---

## 3. Endpoint de Aceite de Convite

### 3.1 Aceitar Convite
- **Método / Rota:** `POST /api/auth/invitations/accept`
- **Payload:**
```json
{
  "token": "inv_789"
}
```
- **Regras:**
  - Valida se `status == 'pending'` e `expiresAt > agora`.
  - Vincula o usuário autenticado na tabela `members` com o papel do convite.
  - Atualiza status do convite para `accepted`.
