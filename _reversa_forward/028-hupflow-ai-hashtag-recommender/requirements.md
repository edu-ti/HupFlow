# Requisitos: Recomendador Inteligente de Hashtags & Coleções Salvas por IA

> Identificador da Feature: `028-hupflow-ai-hashtag-recommender`  
> Data: `2026-10-16`  
> Cenário: `greenfield` (Alinhado ao PRD Clean-Room e Compositor de Posts)  

---

## 1. Visão Geral

Nas redes sociais modernas (Instagram, Threads, LinkedIn e X), hashtags desempenham papéis distintos:
- **LinkedIn**: 3 a 5 hashtags focadas em tópicos de mercado e negócios aumentam a indexação em canais temáticos; o excesso penaliza o alcance no algoritmo.
- **X (Twitter)**: 1 a 2 hashtags curtas evitam o desperdício dos 280 caracteres e previnem classificação como spam.
- **Instagram**: Combinação balanceada de tags amplas (`broad`), nicho (`niche`) e comunidade (`community`) para maximizar descoberta na aba Explorar e busca de palavras-chave.
- **Threads**: 1 tag contextual relevante para criar tópicos de conversa indexados.

Esta feature implementa o **Recomendador de Hashtags com IA e Gerenciador de Coleções Salvas (Hashtag Sets)** do HupFlow, permitindo sugerir tags estratégicas em 1 clique a partir do texto/tema da postagem, bem como salvar blocos de tags corporativas reutilizáveis por nicho.

---

## 2. Requisitos Funcionais (RF)

- **RF-001 (Motor de Recomendação IA)**: Analisar a legenda ou tema do post e retornar hashtags ranqueadas com métricas de relevância (score de 0 a 100) e categorização em 3 tiers:
  - `broad` (grande público / alto volume)
  - `niche` (público-alvo / nicho específico do segmento)
  - `community` (comunidade engajada / hiperespecífica)
- **RF-002 (Otimização por Rede Social)**: Ajustar dinamicamente a contagem e as regras para a rede alvo (`linkedin`, `x`, `instagram`, `threads`):
  - Limite recomendado e aviso de saturação algorítmica.
- **RF-003 (Coleções Salvas / Hashtag Sets)**: Permitir que o workspace crie e gerencie grupos de hashtags reutilizáveis (ex: "SaaS & Tech", "Lançamentos", "Vendas B2B") armazenados na tabela `hashtag_sets`.
- **RF-004 (Endpoints de API)**:
  - `POST /api/ai/hashtags`: recebe `{ text, topic, network, count }` e retorna as tags categorizadas.
  - `GET /api/hashtags/sets`: lista coleções salvas da organização.
  - `POST /api/hashtags/sets`: cria ou atualiza uma coleção salva.
  - `DELETE /api/hashtags/sets`: remove uma coleção da organização.
- **RF-005 (Integração com o Compositor)**:
  - Botão de atalho "Hashtags IA" na barra do Compositor (`/composer`).
  - Modal ou gaveta com preview de tags recomendadas e coleções salvas.
  - Injeção em 1 clique no final do texto do post (adicionando `#` e formatação limpa com quebra de linha).
- **RF-006 (Painel Administrativo)**:
  - Tela `/settings/hashtags` para gerenciar coleções pré-definidas da marca.
  - Atalho no menu lateral do dashboard (`layout.tsx`).

---

## 3. Requisitos Não-Funcionais (RNF)

- **RNF-001 (Arquitetura Clean-Room)**: Zero dependências AGPL ou proprietárias; uso exclusivo do Vercel AI SDK (`ai`, `@ai-sdk/openai`, `zod`) e Drizzle ORM.
- **RNF-002 (Resiliência & Fallbacks Offline)**: Em ambientes sem `OPENAI_API_KEY` configurada, o motor deve usar gerador heurístico semântico baseado em tokens e dicionários de nicho sem quebras de execução.
- **RNF-003 (Isolamento Multi-Tenant)**: Coleções salvas de hashtags são estritamente isoladas por `organization_id`.
- **RNF-004 (Performance)**: Tempo de resposta do recomendador inferior a 1.5s com fallback imediato em menos de 50ms.
- **RNF-005 (TypeScript Estrito)**: 100% de compilação limpa com `tsc --noEmit`.
