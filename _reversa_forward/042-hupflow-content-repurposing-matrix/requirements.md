# Requirements: 042-hupflow-content-repurposing-matrix

## Objetivo
Implementar a **Matriz de Reaproveitamento Multi-Formato IA (Ingestão de 1 Conteúdo Longo $\rightarrow$ Kit Completo de 4 Formatos)** no HupFlow Clean-Room (`hupflow/**`), permitindo que criadores, agências e equipes de marketing peguem um único artigo de blog, transcrição de vídeo/podcast, newsletter ou gravação e gerem simultaneamente um kit completo de distribuição social pronto para o Compositor e Estúdio:
1. **Carrossel LinkedIn / Instagram** (estrutura com 7 slides de alta retenção: Capa, Problema, 3 Passos Práticos, Erro Comum e CTA)
2. **Thread Encadeada X / Twitter** (sequência de 5 tweets com ganchos e emojis)
3. **Roteiro Vertical 9:16 para Reels / TikTok / Shorts** (marcações de tempo 0-3s, 3-25s, 25-45s, 45-60s com safe zones)
4. **Pílula Executiva para Newsletter / WhatsApp / Telegram** (resumo em tópicos com lições acionáveis)

## Requisitos Funcionais
- **RF-042-01 (Gestão Multi-Tenant de Projetos de Reaproveitamento)**: Criar, listar, filtrar por tom (`educational`, `contrarian`, `storytelling`, `executive`), regenerar formatos individuais e excluir kits isolados por `organizationId`.
- **RF-042-02 (Motor Determinístico de Decomposição de Conteúdo IA)**: Função `decomposeLongFormContent` que extrai tese central, pontos-chave, citações de impacto e estatísticas/passos do texto-fonte longo.
- **RF-042-03 (Gerador dos 4 Formatos de Distribuição)**: Funções puras:
  - `generateCarouselSlidesFromLongForm`: Cria array de 7 slides com títulos e corpo estruturado.
  - `generateXThreadFromLongForm`: Cria array de 5 tweets respeitando limite estrito de 280 caracteres por tweet.
  - `generateVerticalVideoScriptFromLongForm`: Cria roteiro 9:16 com 4 blocos de tempo (*Gancho 3s*, *Corpo*, *Exemplo*, *CTA Final*).
  - `generateExecutiveNewsletterSnippet`: Cria texto formatado para envio direto em e-mail ou canal de comunidade.
- **RF-042-04 (Envio em 1 Clique para o Compositor & Estúdio)**: Endpoint `POST /api/repurpose/export` para enviar o carrossel gerado diretamente como rascunho de post ou carrossel para o banco do HupFlow.
- **RF-042-05 (Painel Visual da Matriz de Reaproveitamento)**: Página `/settings/repurpose` com visualizador em 4 abas interativas (**Carrossel**, **Thread X**, **Roteiro Reels**, **Newsletter**) com botões de cópia e exportação.

## Requisitos Não-Funcionais
- **RNF-042-01 (Clean-Room & Zero Dependências Externas)**: Algoritmos determinísticos de chunking e síntese de texto 100% em TypeScript puro (zero dependências AGPL).
- **RNF-042-02 (Isolamento Multi-Tenant & RBAC)**: `requireOrgRole(req, 'viewer')` para listagem (`GET /api/repurpose`) e `requireOrgRole(req, 'member')` para geração e exportação (`POST /api/repurpose`, `POST /api/repurpose/export`).
- **RNF-042-03 (Resiliência com Fallback em Memória)**: Tabela Drizzle `content_repurposing_kits` com fallback automático em memória pré-populado com 2 kits completos realistas.
