# Requisitos: Feed RSS Integrator & Publicação Automatizada com IA

> Identificador da Feature: `030-hupflow-rss-auto-publishing`  
> Data: `2026-10-16`  
> Cenário: `greenfield` (Alinhado ao PRD Clean-Room, Compositor de Posts e IA)  

---

## 1. Visão Geral

Empresas, veículos de mídia e criadores frequentemente publicam artigos em seus próprios blogs (WordPress, Ghost, Substack, Medium) ou monitoram canais do setor via RSS/Atom. Converter manualmente cada artigo publicado em posts sociais adaptados para LinkedIn, X, Instagram e Threads consome tempo e gera atrasos na distribuição.

Esta feature introduz o **Integrador de Feeds RSS/Atom & Automação de Rascunhos com IA** do HupFlow, permitindo:
1. Conectar múltiplos feeds RSS/Atom corporativos ao workspace com validação instantânea.
2. Monitorar e capturar novos artigos preservando GUIDs únicos para evitar republicações e duplicatas.
3. Transformar qualquer artigo capturado em post social formatado com IA (gerando gancho, síntese em tópicos, hashtags e link de referência).
4. Suporte a modo rascunho assistido (com revisão humana no Compositor) ou publicação automatizada direta para a fila.

---

## 2. Requisitos Funcionais (RF)

- **RF-001 (Parser Nativo RSS 2.0 & Atom)**:
  - Analisador XML/RSS leve em TypeScript sem dependências pesadas ou licenças restritivas.
  - Extração de `title`, `link`, `guid`, `pubDate`, `description` e imagem de capa (`enclosure` ou tag `media:content`).
- **RF-002 (Persistência & Deduplicação)**:
  - Tabela `rss_feeds` para armazenar fontes cadastradas com status (`active` | `paused`), canais alvo e flag `autoPublish`.
  - Tabela `rss_feed_items` para armazenar artigos detectados com unicidade composta `(feed_id, guid)` para prevenir duplicação.
- **RF-003 (Síntese & Geração de Rascunhos com IA)**:
  - Função `synthesizeRssItemToPost` que recebe título e resumo do artigo e gera:
    - Gancho editorial de abertura.
    - Síntese estruturada do artigo em bullet points respeitando limites da rede.
    - Hashtags de nicho recomendadas.
    - Chamada para ação com o link original do artigo encurtado ou direto.
- **RF-004 (Endpoints de API)**:
  - `GET /api/rss`: lista feeds cadastrados e seus últimos artigos.
  - `POST /api/rss`: cadastra e valida novo feed.
  - `DELETE /api/rss`: remove feed e seus itens vinculados.
  - `POST /api/rss/sync`: aciona sincronização e busca de novos itens.
  - `POST /api/rss/draft`: converte item em rascunho de post social.
- **RF-005 (Painel Administrativo & Visual)**:
  - Tela `/settings/rss` para monitoramento de feeds, artigos recentes e atalho de conversão em 1 clique.
  - Atalho no menu lateral do dashboard em `layout.tsx` com ícone `Rss`.

---

## 3. Requisitos Não-Funcionais (RNF)

- **RNF-001 (Clean-Room Estrito)**: Zero dependências AGPL ou proprietárias; parser XML/RSS nativo em TypeScript.
- **RNF-002 (Isolamento Multi-Tenant)**: Feeds e artigos são estritamente isolados por `organization_id`.
- **RNF-003 (Resiliência & Tolerância a Falhas)**: Feeds externos offline ou com XML malformado não quebram o sistema e são sinalizados com status de erro sem travar o worker.
- **RNF-004 (TypeScript Estrito)**: Zero erros de compilação em `tsc --noEmit`.
