# Investigação Técnica: Trilha de Auditoria do Workspace

> Identificador: `024-hupflow-workspace-audit-logs`  
> Data: `2026-10-16`  

---

## 1. Análise da Arquitetura Atual

1. **Contexto de Autenticação (`AuthContext`)**:
   - `auth.user.id`, `auth.user.name`, `auth.user.email` já estão disponíveis em todas as rotas protegidas pelo middleware `requireOrgRole`.
   - Isso permite identificar com precisão o ator responsável por cada ação.
2. **Histórico Existente vs. Auditoria Global**:
   - A Feature 022 implementou `post_approval_history` específico para aprovações editoriais.
   - A Feature 024 cria uma tabela transversal e unificada `workspace_audit_logs`, capaz de catalogar tanto aprovações quanto mutações de segurança, canais, membros, webhooks e faturamento.
3. **Desempenho & Não-bloqueio**:
   - Inserções de log de auditoria devem ser executadas com `try/catch` independente ou assincronamente via `void recordAuditLog(...)` para garantir que eventuais falhas na gravação do log não interrompam o fluxo principal do usuário (ex: criação de um post ou convite de membro).
4. **Exportação CSV sem bibliotecas pesadas**:
   - A exportação CSV pode ser realizada com um serializador nativo TypeScript puro, que escapa adequadamente aspas e vírgulas (RFC 4180), gerando um `Blob` com MIME type `text/csv;charset=utf-8;`.
