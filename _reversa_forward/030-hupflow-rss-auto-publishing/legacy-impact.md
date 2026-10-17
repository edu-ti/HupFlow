# Análise de Impacto no Legado — Feature 030: RSS Auto-Publishing

## 1. Visão Geral das Alterações
A **Feature 030** introduz o leitor nativo e agregador de feeds RSS 2.0 e Atom para ingestão periódica de artigos de blogs, notícias e portais, convertendo-os em rascunhos otimizados para redes sociais (LinkedIn, X/Twitter, Instagram, Threads) com auxílio de IA Clean-Room.

## 2. Componentes Criados & Alterados
- **Modelos e Schemas (`hupflow/src/lib/db/schema.ts`, `hupflow/src/lib/rss/types.ts`)**:
  - Tabelas `rss_feeds` e `rss_feed_items` criadas com suporte a isolamento por workspace, status de polling, contadores de erros e metadados de mídia/tags.
- **Serviço de Ingestão e Síntese (`hupflow/src/lib/rss/service.ts`)**:
  - Parser nativo XML RSS/Atom sem dependências AGPL ou binárias pesadas.
  - Sanitização de entidades HTML e tags com regex Clean-Room.
  - Extrator de metadados (`guid`, `enclosure`, `media:content`, `author`, `pubDate`).
  - Motor de síntese de rascunhos sociais adaptados aos limites e estilo de cada rede.
- **APIs REST (`hupflow/src/app/api/rss/route.ts`, `/sync/route.ts`, `/draft/route.ts`)**:
  - Operações completas de CRUD, sincronização síncrona manual e conversão de artigo em rascunho de postagem.
- **Interface de Usuário (`hupflow/src/components/rss/AddFeedModal.tsx`, `hupflow/src/app/(dashboard)/settings/rss/page.tsx`)**:
  - Painel de gerenciamento com métricas agregadas (total de feeds, artigos sincronizados, pendentes e posts gerados).
  - Modal de cadastro de feed com validação instantânea de URL.
  - Modal de síntese de rascunhos com preview de caracteres por rede e envio direto ao agendador.
- **Navegação (`hupflow/src/app/(dashboard)/layout.tsx`)**:
  - Adicionado atalho 'Feeds RSS' com ícone `Rss`.

## 3. Impacto no Sistema Legado
- **Isolamento de Dados**: Totalmente isolado por `workspace_id`. Não altera esquemas existentes de agendamento ou carrosséis.
- **Compatibilidade Retroativa**: 100% preservada. Rascunhos gerados integram-se organicamente com o compositor (`/composer`) e o agendador de posts existente.
- **Zero AGPL**: Implementação 100% autônoma Clean-Room, sem libs de RSS de terceiros sujeitas a licenças restritivas.
