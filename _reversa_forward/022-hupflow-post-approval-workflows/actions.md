# Actions: Fluxo Editorial de Aprovações (Post Approval Workflows)

> Identificador: `022-hupflow-post-approval-workflows`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/022-hupflow-post-approval-workflows/roadmap.md`  

---

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 9 |
| Concluídas | 9 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 4 |
| Taxa de Sucesso | 100% |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Definir interfaces TypeScript para estados, ações e auditoria em types.ts | - | `[//]` | `hupflow/src/lib/approvals/types.ts` | 🟢 | `[X]` |
| T002 | Adicionar campos de aprovação em posts e tabela post_approval_history em schema.ts | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para máquina de estados de aprovação e validação RBAC | T001 | - | `hupflow/src/lib/approvals/approvals.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar regras de transição e mutações atômicas em service.ts | T001, T002 | - | `hupflow/src/lib/approvals/service.ts` | 🟢 | `[X]` |
| T005 | Criar rota REST /api/posts/approval (GET e POST) com isolamento multi-tenant | T001, T004 | - | `hupflow/src/app/api/posts/approval/route.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar tela Central de Revisão & Aprovações em /approvals/page.tsx | T005 | `[//]` | `hupflow/src/app/(dashboard)/approvals/page.tsx` | 🟢 | `[X]` |
| T007 | Integrar seletor de status e submissão de aprovação no Compositor de Posts | T001, T005 | - | `hupflow/src/app/(dashboard)/composer/page.tsx` | 🟢 | `[X]` |
| T008 | Adicionar atalho "Aprovações & Revisão" no menu de navegação em layout.tsx | T006 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Bateria completa de testes com tsx, validação estática tsc --noEmit e governança | T003, T005, T006, T007, T008 | - | `hupflow/` | 🟢 | `[X]` |

---

## Notas de execução

- **T001-T002**: Tipagem estrita de `PostApprovalStatus`, `ApprovalAction`, `PostWithApproval`, campos de aprovação em `posts` e tabela `post_approval_history`.
- **T003-T005**: Máquina de estados (`validateApprovalTransition`), trava de publicação (`canPublishPost`), mutações atômicas com histórico e rotas REST completas com contadores por status.
- **T006-T008**: Central de Revisão & Aprovações em `/approvals` com tabs, badges e modal de feedback editorial, botão no Compositor e atalho no layout.
- **T009**: 100% dos testes unitários aprovados e zero erros em `tsc --noEmit`.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
| 2026-10-16 | Conclusão integral de T001 a T009 com 100% dos testes aprovados | reversa-coding |
