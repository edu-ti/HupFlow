# Roadmap: Unified Social Inbox & AI Smart Replies

> Identificador: `034-hupflow-social-inbox-unified`  
> Data: `2026-10-17`  

---

## Fases de Execução

### Fase 1: Fundação de Dados e Contratos
- Criar tipos em `hupflow/src/lib/inbox/types.ts` (`SocialInboxMessage`, `InboxChannel`, `InboxIntent`, `InboxSentiment`, `InboxPriority`, `InboxStatus`, `SmartReplySuggestion`, `InboxStats`).
- Adicionar a tabela `social_inbox_messages` em `hupflow/src/lib/db/schema.ts`.

### Fase 2: Classificador de Intenção, Gerador Smart Replies e Testes Unitários
- Criar `hupflow/src/lib/inbox/inbox.test.ts` implementando e validando:
  - `classifyInboxMessage(content)`: detecção determinística de `lead_intent`, `support`, `praise`, `question` e `spam`, sentimento (`positive`, `neutral`, `negative`) e prioridade (`high`, `normal`, `low`).
  - `generateSmartReplies(message, brandName)`: geração de 3 sugestões de resposta rápida (Consultiva, Amigável, Direta) com respeito ao limite de caracteres do canal (ex: X 280 chars).
  - `interpolateReplyTemplate(template, vars)`: substituição segura de variáveis dinâmicas.
  - `calculateInboxStats(messages)`: cálculo de não lidas, leads comerciais e taxa de resposta (`responseRate`).

### Fase 3: Camada de Serviço e Rotas de API REST
- Implementar `hupflow/src/lib/inbox/service.ts` com persistência Drizzle em `social_inbox_messages` e fallback resiliente em memória (com interações realistas de LinkedIn, Instagram, X e Threads).
- Criar rotas REST:
  - `GET / POST` em `hupflow/src/app/api/inbox/route.ts`.
  - `POST` em `hupflow/src/app/api/inbox/reply/route.ts`.

### Fase 4: Console de Resposta IA (`InboxThreadDetail.tsx`) e Página `/inbox`
- Criar `hupflow/src/components/inbox/InboxThreadDetail.tsx` com exibição da publicação original, badges de intenção/sentimento, botões de Smart Replies em 1 clique, macros salvas e editor de resposta.
- Criar `hupflow/src/app/(dashboard)/inbox/page.tsx` com filtros rápidos (Não lidas, Leads Comerciais, Suporte, Todas), filtro por canal e simulador de nova menção.

### Fase 5: Navegação, Testes e Sincronização SDD
- Adicionar item `'Social Inbox & IA'` com ícone `MessageSquareText` (ou `Inbox`) em `hupflow/src/app/(dashboard)/layout.tsx`.
- Executar `npx tsx src/lib/inbox/inbox.test.ts` e `npx tsc --noEmit`.
- Gerar `legacy-impact.md`, `regression-watch.md`, adendo SDD 034 e atualizar `SESSION_HANDOFF.md`.
