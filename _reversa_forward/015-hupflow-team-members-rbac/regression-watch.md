# Regression Watch: Gestão de Membros, Convites por E-mail & Papéis RBAC

> Identificador: `015-hupflow-team-members-rbac`  
> Data: `2026-10-16`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/permissions.md`, `_reversa_sdd/sdd/01-auth-multitenant.md`)  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W014 | `requirements.md#RN-01` | O proprietário (owner) da organização nunca pode ser removido nem ter seu papel rebaixado | Presença / Lógica | Rota `DELETE /api/org/members/[id]` ou `PATCH` permitindo alterar ou excluir o membro com papel `owner` |
| W015 | `requirements.md#RN-02` | Somente usuários com papel `admin` ou `owner` podem emitir convites ou gerenciar colaboradores | Presença | Rotas `/api/org/members` ou `/api/org/invitations` aceitando requisições de usuários com papel `member` ou `viewer` |
| W016 | `requirements.md#RN-04` | Convites expirados (`expiresAt < new Date()`) ou com status diferente de `pending` devem ser rejeitados | Comportamento | Rota `/api/auth/invitations/accept` aceitando convite vencido ou reutilizado |

---

## 2. Observações

- **RF-01**: Helper `hasMinRole` e função de guarda `canManageMember` validados com 100% de sucesso em `rbac.test.ts`.
- **RF-02 & RF-03**: Rotas de membros e convites protegidas por `requireOrgRole(req, 'admin')`.
- **RF-04**: Endpoint de aceite valida status `pending`, data de validade e impede duplicatas em `members`.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
