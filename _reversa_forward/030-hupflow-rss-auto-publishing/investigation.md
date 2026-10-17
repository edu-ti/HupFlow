# Investigação Técnica: Feed RSS Integrator & Automação de Posts com IA

> Identificador da Feature: `030-hupflow-rss-auto-publishing`  
> Data: `2026-10-16`  

---

## 1. Desafios Arquiteturais

1. **Parser de RSS/Atom sem Libs Externas Pesadas**:
   - Bibliotecas como `rss-parser` podem trazer dependências desnecessárias ou vulnerabilidades.
   - O formato RSS 2.0 (`<item>`) e Atom (`<entry>`) possui estrutura textual XML bem definida (`<title>`, `<link>`, `<guid>` / `<id>`, `<pubDate>` / `<updated>`, `<description>` / `<summary>`, `<enclosure url="...">`).
   - Um analisador nativo com expressões regulares robustas e decodificação de entidades HTML provê velocidade altíssima (< 10ms) e zero dependências externas.

2. **Deduplicação de Artigos e Idempotência**:
   - Cada feed possui seu identificador único de artigo (`guid` no RSS ou `id` no Atom). Caso ausente, utiliza-se o próprio `link` ou hash SHA-256 do título+link.
   - A tabela `rss_feed_items` deve ter índice único composto em `(feed_id, guid)` para impedir que múltiplas sincronizações criem posts repetidos.

3. **Síntese Inteligente com IA e Limites por Rede**:
   - O artigo original possui centenas ou milhares de palavras. O motor de síntese deve gerar:
     - Versão LinkedIn: 1 gancho forte + 3 pontos-chave em bullet points + pergunta final + link.
     - Versão X: síntese incisiva até 240 caracteres + link + 1 hashtag.
     - Versão Threads: pergunta reflexiva sobre o artigo.
     - Versão Instagram: carrossel em tópicos ou legenda para imagem de capa.

4. **Multi-Tenancy e Isolamento**:
   - Tabelas `rss_feeds` e `rss_feed_items` com `organizationId` estrito e exclusão em cascata.
