# Interfaces de API: Feature 022 - Fluxo Editorial de Aprovações

> Identificador: `022-hupflow-post-approval-workflows`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Endpoints REST

### 1.1 Listar Posts por Status de Aprovação
`GET /api/posts/approval?status=in_review`
- **Autenticação**: Requer sessão com `organizationId` (mínimo `viewer`).
- **Query Params**: `status` opcional (`all`, `in_review`, `approved`, `rejected`, `draft`).
- **Resposta**:
  ```json
  {
    "posts": [
      {
        "id": "post_01J...",
        "content": "...",
        "approvalStatus": "in_review",
        "author": { "name": "...", "email": "..." },
        "submittedAt": "2026-10-16T19:00:00Z",
        "rejectionReason": null,
        "scheduledAt": "2026-10-18T14:00:00Z",
        "channels": ["linkedin", "x"]
      }
    ],
    "counts": {
      "inReview": 3,
      "approved": 12,
      "rejected": 1,
      "draft": 5
    }
  }
  ```

### 1.2 Transicionar Status de Aprovação
`POST /api/posts/approval`
- **Autenticação**: Requer `member` para submissão; `admin` ou `owner` para aprovação/rejeição.
- **Body**:
  ```json
  {
    "postId": "post_01J...",
    "action": "approve | reject | submit",
    "feedback": "Texto opcional ou obrigatório se reject"
  }
  ```
- **Resposta**:
  ```json
  {
    "success": true,
    "postId": "post_01J...",
    "previousStatus": "in_review",
    "currentStatus": "approved",
    "action": "approve"
  }
  ```

### 1.3 Obter Histórico de Auditoria do Post
`GET /api/posts/approval/history?postId=post_01J...`
- **Resposta**:
  ```json
  {
    "history": [
      {
        "id": "appr_01J...",
        "action": "submit",
        "fromStatus": "draft",
        "toStatus": "in_review",
        "actor": { "name": "..." },
        "feedback": "Pronto para revisão editorial",
        "createdAt": "2026-10-16T19:00:00Z"
      }
    ]
  }
  ```
