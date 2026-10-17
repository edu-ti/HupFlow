# Requisitos: Unified Social Inbox & AI Smart Replies

> Identificador: `034-hupflow-social-inbox-unified`  
> Data: `2026-10-17`  
> Autor: Antigravity (Reversa Autonomous Pipeline)  
> Status: Aprovado  

---

## 1. Contexto & Proposta de Valor
Publicar carrosséis, Reels e threads gera dezenas de comentários, perguntas comerciais e menções distribuídas entre **LinkedIn, Instagram, Threads e X/Twitter**. Alternar entre múltiplas abas e aplicativos móveis faz com que agências e equipes comerciais percam leads quentes ("Qual o valor do plano Agency?", "Tem integração via API?") ou demorem horas para responder dúvidas críticas.

O **HupFlow Unified Social Inbox & AI Smart Replies** centraliza todas as interações em uma única caixa de entrada inteligente e multi-tenant:
1. **Triagem Semântica Automática de Intenção e Sentimento**: Classificador determinístico Clean-Room (`classifyInboxMessage`) que identifica automaticamente a intenção (`lead_intent`, `support`, `praise`, `question`, `spam`) e o sentimento (`positive`, `neutral`, `negative`), atribuindo prioridade (`high`, `normal`, `low`).
2. **Gerador de Respostas Rápidas com IA (`generateSmartReplies`)**: Sugere 3 variações contextuais de resposta imediata por mensagem (tons: *Consultivo/Comercial*, *Amigável/Engajador* e *Objetivo/Direto*), respeitando o limite de caracteres da rede social de origem.
3. **Templates de Respostas Salvas (Saved Replies / Macros)**: Biblioteca de respostas rápidas com interpolação de variáveis dinâmicas (`{{author_name}}`, `{{workspace_name}}`, `{{channel}}`).
4. **Filtros de Produtividade ("Inbox Zero")**: Filtragem em tempo real por status (`unread`, `replied`, `archived`), por rede social (`linkedin`, `instagram`, `x`, `threads`) e por intenção (ex: filtrar apenas **Oportunidades de Venda / Leads**).
5. **Painel Unificado `/inbox`**: Interface dividida em lista de conversas/comentários à esquerda e console de resposta rápida com sugestões IA à direita, integrada ao menu principal do dashboard.

---

## 2. Requisitos Funcionais (RF)
- **RF-001**: O sistema deve armazenar mensagens/interações (`social_inbox_messages`) vinculadas ao `organization_id`, contendo: `id`, `channel` (`linkedin`, `instagram`, `x`, `threads`), `interactionType` (`comment`, `mention`, `dm`), `authorName`, `authorHandle`, `authorAvatar`, `postTitle`, `content`, `intent` (`lead_intent`, `support`, `praise`, `question`, `spam`), `sentiment` (`positive`, `neutral`, `negative`), `priority` (`high`, `normal`, `low`), `status` (`unread`, `replied`, `archived`), `replyText`, `repliedAt`, `repliedBy` e `receivedAt`.
- **RF-002**: O classificador `classifyInboxMessage(text)` deve analisar o texto recebido e retornar `{ intent, sentiment, priority }` de forma determinística e auditável.
- **RF-003**: O gerador `generateSmartReplies(message, brandName)` deve retornar 3 opções de respostas rápidas contextualizadas com a intenção detectada (`lead_intent`, `support`, `praise`, `question`).
- **RF-004**: O interpolador `interpolateReplyTemplate(template, vars)` deve substituir placeholders `{{author_name}}` e `{{brand_name}}` de forma segura.
- **RF-005**: As rotas REST `/api/inbox` (`GET`, `POST`) e `/api/inbox/reply` (`POST`) devem operar com controle RBAC (`viewer` para leitura, `member` para responder/arquivar/criar).
- **RF-006**: A página `/inbox` deve permitir filtrar interações, visualizar o detalhe da mensagem no componente `InboxThreadDetail.tsx`, aplicar uma sugestão IA em 1 clique e enviar a resposta.

---

## 3. Requisitos Não-Funcionais (RNF)
- **RNF-001 (Clean-Room & Zero AGPL)**: Algoritmos de classificação de intenção, análise de sentimento léxica e geração de smart replies 100% autorais em TypeScript.
- **RNF-002 (Isolamento Multi-Tenant)**: Todas as mensagens da caixa de entrada são estritamente isoladas por `organization_id`.
- **RNF-003 (Tipagem Estrita)**: Conformidade 100% validada via `npx tsc --noEmit`.
