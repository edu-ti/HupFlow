# Análise de Impacto no Sistema: Dead-Letter Queue & Reprocessamento de Falhas

> Identificador da Feature: `025-hupflow-publishing-dead-letter-queue`  
> Data: `2026-10-16`  
> Responsável: Equipe de Governança Reversa  

---

## 1. Escopo de Impacto

A Feature 025 introduziu a **Dead-Letter Queue (DLQ)** e a Central de Reprocessamento de Falhas para lidar com incidentes nas APIs das redes sociais:
- Prevenção ativa de perda de postagens que falharam por expiração de credenciais OAuth, limite de requisições (rate limits) ou incompatibilidade de mídia.
- Diagnóstico automático e classificação do erro sem jargões indecifráveis para o usuário.
- Mecanismo seguro de retry seletivo: apenas os canais com falha são reenfileirados, evitando a republicação acidental de canais que já foram entregues com sucesso.
- Interface de gestão em `/queue/failures` com tabs por status e modal de edição prévia.

O impacto é **100% aditivo e seguro**:
- Adição da tabela `publishing_dlq` no Drizzle ORM com chaves estrangeiras vinculadas a `posts`, `post_channels` e `organizations`.
- Nova rota REST `/api/posts/dlq` protegida por RBAC (`requireOrgRole(req, 'member')`).
- Integração de atalho visual na navegação do dashboard.

---

## 2. Matriz de Componentes Afetados

| Componente | Tipo de Modificação | Risco | Mitigação Aplicada |
|------------|---------------------|:-----:|-------------------|
| `hupflow/src/lib/db/schema.ts` | Adição da tabela `publishing_dlq` | Baixo | Sem breaking changes; apenas criação de nova tabela no Drizzle ORM. |
| `hupflow/src/lib/dlq/types.ts` | Novo arquivo de tipos e categorias | Mínimo | Interfaces TypeScript estritas com tipos literais para status e categorias. |
| `hupflow/src/lib/dlq/service.ts` | Serviço de diagnóstico e reprocessamento | Baixo | Diagnóstico funcional determinístico e atomicidade na atualização de canais. |
| `hupflow/src/app/api/posts/dlq/route.ts` | Nova rota REST (GET, POST) | Baixo | Proteção RBAC com `requireOrgRole(req, 'member')`. |
| `hupflow/src/app/(dashboard)/queue/failures/page.tsx` | Nova página da Central de Falhas | Mínimo | Componente cliente React com tabs, modal de edição e reprocessamento em 1 clique. |
| `hupflow/src/app/(dashboard)/layout.tsx` | Adição de link na sidebar | Mínimo | Adição de item sem alterações de layout base. |
