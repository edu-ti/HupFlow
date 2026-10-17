# Actions: Gestão de Membros, Convites por E-mail & Papéis RBAC

> Identificador: `015-hupflow-team-members-rbac`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/015-hupflow-team-members-rbac/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 9 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 4 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Expandir definições de tipos em types.ts com suporte a viewer, resumos de membros e convites | - | `[//]` | `hupflow/src/lib/auth/types.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T002 | Criar testes unitários para validação de hierarquia RBAC, proteção de owner e autorização | T001 | `[//]` | `hupflow/src/lib/auth/rbac.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Implementar helpers RBAC (hasMinRole, requireOrgRole, canManageMember) em rbac.ts | T001 | - | `hupflow/src/lib/auth/rbac.ts` | 🟢 | `[X]` |
| T004 | Implementar rotas REST de membros (/api/org/members) para listagem, alteração de papel e remoção | T003 | - | `hupflow/src/app/api/org/members/route.ts` | 🟢 | `[X]` |
| T005 | Implementar rotas REST de convites (/api/org/invitations) para criação, listagem e cancelamento | T003 | `[//]` | `hupflow/src/app/api/org/invitations/route.ts` | 🟢 | `[X]` |
| T006 | Implementar endpoint de aceite de convite (/api/auth/invitations/accept) com vinculação de membro | T003 | - | `hupflow/src/app/api/auth/invitations/accept/route.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T007 | Criar tela /settings/members no dashboard com tabelas de membros, convites e modal de convite | T004, T005 | - | `hupflow/src/app/(dashboard)/settings/members/page.tsx` | 🟢 | `[X]` |
| T008 | Criar tela /accept-invite e adicionar atalho "Membros" na barra lateral de navegação | T006, T007 | `[//]` | `hupflow/src/app/(auth)/accept-invite/page.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Executar testes unitários com tsx e validação estática tsc --noEmit na base inteira | T002, T004, T005, T006, T007, T008 | - | `hupflow/` | 🟢 | `[X]` |

---

## Notas de execução

- Todas as 9 ações atômicas da Feature 015 foram executadas com sucesso.
- O subsistema RBAC hierárquico (`owner > admin > member > viewer`) foi implementado em `rbac.ts` com validação de menor privilégio e proteção inviolável do `owner`.
- As rotas REST de membros (`/api/org/members`) e convites (`/api/org/invitations`) foram criadas e blindadas.
- O endpoint de aceite de convite (`/api/auth/invitations/accept`) e a página `/accept-invite` foram entregues.
- A página `/settings/members` foi construída em Dark Mode com tabelas de membros, convites, modal de convite e cópia de link em 1 clique.
- O atalho "Equipe & Membros" foi integrado na barra lateral do dashboard.
- Todos os testes unitários (`rbac.test.ts`, `session.test.ts`, `validation.test.ts`) e a compilação `tsc --noEmit` passaram com 100% de sucesso.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
