# Roadmap: Feature 022 - Fluxo Editorial de Aprovações

> Identificador: `022-hupflow-post-approval-workflows`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## Fases de Entrega

1. **Fase 1: Preparação & Modelagem**
   - Definir interfaces TypeScript para status e ações de aprovação em `src/lib/approvals/types.ts`.
   - Adicionar campos na tabela `posts` e criar tabela `post_approval_history` em `src/lib/db/schema.ts`.

2. **Fase 2: Testes Unitários de Transição & RBAC**
   - Criar bateria de testes unitários para a máquina de estados e restrições de papéis em `src/lib/approvals/approvals.test.ts`.

3. **Fase 3: Núcleo do Serviço & APIs REST**
   - Implementar motor de validação de transição e mutação atômica em `src/lib/approvals/service.ts`.
   - Criar rotas `/api/posts/approval/route.ts` e `/api/posts/approval/history/route.ts`.

4. **Fase 4: Interfaces de Usuário & Navegação**
   - Criar Central de Revisão & Aprovações em `src/app/(dashboard)/approvals/page.tsx` com tabs, preview de post e modal de feedback.
   - Atualizar Compositor de Posts (`src/app/(dashboard)/composer/page.tsx`) com status e botão de submissão.
   - Adicionar atalho "Aprovações & Revisão" no menu lateral do dashboard em `src/app/(dashboard)/layout.tsx`.

5. **Fase 5: Polimento & Governança**
   - Executar bateria completa de testes unitários com `npx tsx`.
   - Validação estática sem erros com `npx tsc --noEmit`.
   - Documentação de adendo em `_reversa_sdd/addenda/022-hupflow-post-approval-workflows.md`, `legacy-impact.md` e `regression-watch.md`.
