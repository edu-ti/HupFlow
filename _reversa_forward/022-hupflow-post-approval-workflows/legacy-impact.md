# Legacy Impact: Feature 022 - Fluxo Editorial de Aprovações

> Identificador: `022-hupflow-post-approval-workflows`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Visão Geral das Alterações

A Feature 022 introduz o subsistema de **Aprovações Editoriais** no HupFlow, separando o ciclo de criação e qualidade de conteúdo do ciclo de agendamento e despacho para as redes sociais. Isso permite que agências e equipes corporativas revisem e aprovem cópias e mídias antes da publicação final.

---

## 2. Arquivos Criados ou Modificados

| Arquivo | Natureza | Descrição do Impacto |
|---------|:--------:|----------------------|
| `hupflow/src/lib/approvals/types.ts` | Novo | Tipos e contratos da máquina de estados (`PostApprovalStatus`, `ApprovalAction`, `PostWithApproval`, `ApprovalCounts`). |
| `hupflow/src/lib/approvals/service.ts` | Novo | Regras de validação de transição de status (`validateApprovalTransition`, `canPublishPost`, `executeApprovalTransition`). |
| `hupflow/src/lib/approvals/approvals.test.ts` | Novo | Bateria unitária de testes cobrindo transições, restrições de papéis RBAC e trava de despacho. |
| `hupflow/src/lib/db/schema.ts` | Modificado | Inclusão dos campos de aprovação em `posts` e criação da tabela `post_approval_history`. |
| `hupflow/src/app/api/posts/approval/route.ts` | Novo | Endpoints REST para consulta filtrada por status com contadores agregados e transições atômicas. |
| `hupflow/src/app/api/posts/approval/history/route.ts` | Novo | Endpoint para recuperação do histórico de auditoria e justificativas de revisão de posts. |
| `hupflow/src/app/(dashboard)/approvals/page.tsx` | Novo | Painel da Central de Revisão & Aprovações com tabs, badges e modal de feedback. |
| `hupflow/src/app/(dashboard)/composer/page.tsx` | Modificado | Botão "Submeter para Revisão" e link direto para a Central de Aprovações. |
| `hupflow/src/app/(dashboard)/layout.tsx` | Modificado | Atalho "Aprovações & Revisão" no menu de navegação lateral. |

---

## 3. Compatibilidade Regressiva & Regras de Isolamento

1. **Compatibilidade Retrospectiva**: Posts existentes na tabela `posts` recebem `approvalStatus: 'approved'` por padrão, preservando 100% da operação da fila e publicações já agendadas.
2. **Isolamento Multi-tenant**: Todas as consultas e mutações de aprovação exigem e filtram pelo `organizationId` ativo na sessão.
3. **Governança RBAC**: Apenas `admin` ou `owner` podem transicionar posts para `'approved'` ou `'rejected'`. Membros comuns têm acesso apenas a `'submit'`.
4. **Conformidade Clean-Room**: 100% implementado em TypeScript estrito, sem pacotes de workflow proprietários.
