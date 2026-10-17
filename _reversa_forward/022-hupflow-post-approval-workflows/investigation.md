# Investigação Técnica: Feature 022 - Fluxo Editorial de Aprovações

> Identificador: `022-hupflow-post-approval-workflows`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Análise da Arquitetura Atual

1. **Estado Atual de `posts`**:
   - Atualmente, a tabela `posts` rastreia apenas o status de envio técnico (`status`: `draft`, `scheduled`, `publishing`, `published`, `failed`).
   - Não havia um ciclo de governança editorial que impedisse um membro de agendar diretamente sem a revisão de um coordenador ou cliente da agência.
   - Adicionando `approvalStatus` (`draft`, `in_review`, `approved`, `rejected`), separamos com clareza o ciclo editorial (qualidade) do ciclo de despacho (execução de rede).

2. **Regras de RBAC Existentes**:
   - `src/lib/auth/rbac.ts` já implementa `requireOrgRole(req, minRole)`.
   - Papéis hierárquicos: `owner` > `admin` > `member` > `viewer`.
   - Submissão para revisão: Qualquer `member`, `admin` ou `owner`.
   - Aprovação ou Rejeição: Exclusivo para `admin` ou `owner` (`hasMinRole(auth.organizationRole, 'admin')`).

3. **Integração no Compositor e Fila**:
   - No Compositor (`/composer`), quando o usuário não for `admin` ou `owner`, o botão primário se torna "Submeter para Revisão".
   - A fila de agendamento e o cron de publicação (`scheduler`) só processam posts cujo `approvalStatus === 'approved'`.

---

## 2. Decisões Arquiteturais Clean-Room

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Máquina de Estados | Função pura `validateApprovalTransition` | Previne transições inválidas (ex: aprovar rascunho sem submissão). |
| Auditoria | Tabela `post_approval_history` | Rastreabilidade completa de revisores, carimbos e feedbacks editoriais. |
| Compatibilidade | Default `'approved'` para posts existentes | Garante que posts já agendados continuem funcionando sem quebras. |
