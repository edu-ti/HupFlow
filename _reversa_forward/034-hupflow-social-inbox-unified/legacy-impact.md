# Análise de Impacto no Legado — Feature 034: Unified Social Inbox & AI Smart Replies

## 1. Visão Geral das Alterações
A **Feature 034** introduz uma Central Unificada de Interações e Comentários Sociais (`/inbox`) com triagem automática de intenção (`lead_intent`, `support`, `praise`, `question`, `spam`), análise de sentimento e gerador de respostas inteligentes em 1 clique (`generateSmartReplies`), integrando LinkedIn, Instagram, Threads e X/Twitter.

## 2. Componentes Criados & Alterados
- **Modelos e Schemas (`hupflow/src/lib/db/schema.ts`, `hupflow/src/lib/inbox/types.ts`)**:
  - Tabela `social_inbox_messages` com isolamento multi-tenant estrito por `organization_id`.
- **Motor Semântico & Smart Replies (`hupflow/src/lib/inbox/inbox.test.ts`)**:
  - Classificador determinístico `classifyInboxMessage`.
  - Gerador contextual `generateSmartReplies` com limite adaptativo por rede social (ex: 280 caracteres para X).
  - Interpolador de variáveis `interpolateReplyTemplate` (`{{author_name}}`, `{{brand_name}}`, `{{channel}}`).
  - Calculador de SLA `calculateInboxStats`.
- **Camada de Serviço (`hupflow/src/lib/inbox/service.ts`)**:
  - Persistência Drizzle ORM com fallback em memória.
- **Rotas de API REST (`/api/inbox`, `/api/inbox/reply`)**:
  - Endpoints protegidos por RBAC (`viewer` para leitura/filtros, `member` para ingestão e envio de respostas).
- **Console de Resposta & Interface (`InboxThreadDetail.tsx`, `/inbox/page.tsx`, `layout.tsx`)**:
  - Visão master-detail com filtros por intenção comercial (`lead_intent`) e rede social.
  - Atalho `'Social Inbox & IA'` (`Leads`) no topo da barra lateral do dashboard.

## 3. Impacto no Sistema Legado
- **Isolamento de Dados**: Totalmente isolado por `organization_id`.
- **Compatibilidade Retroativa**: 100% preservada.
- **Zero AGPL**: Código 100% autoral em TypeScript, sem dependências restritivas.
