# Investigation: Métricas Sociais, Agregações e Gráficos Vetoriais Nativos

> Identificador: `016-hupflow-analytics-metrics`  
> Data: `2026-10-16`  

---

## 1. Contexto e Benchmarking

Plataformas de gestão de mídia social (Postiz, Buffer, Hootsuite) necessitam de dashboards analíticos com foco em 3 perguntas centrais para o criador/agência:
1. *Qual é o crescimento do meu alcance consolidado ao longo do tempo?*
2. *Qual rede social está trazendo o maior retorno de engajamento?*
3. *Quais publicações específicas performaram melhor para que eu possa replicar a fórmula de conteúdo?*

---

## 2. Abordagem de Gráficos: SVG Nativo vs Bibliotecas Externas

### Bibliotecas Externas (Recharts, Chart.js, Tremor)
- **Prós:** Componentes pré-construídos rápidos.
- **Contras:** 
  - Tamanho de bundle elevado (+150KB a +400KB).
  - Problemas recorrentes de renderização no SSR do Next.js 15 (React 19).
  - Estilização rígida e difícil de adaptar ao Dark Mode refinado do HupFlow.
  - Possíveis riscos de licenciamento dependendo da biblioteca.

### Solução Escolhida: Componente de Área e Linha em SVG Puro
- **Prós:** 
  - Zero dependências adicionais no `package.json`.
  - Desempenho instantâneo e renderização 100% vetorial sem flicker.
  - Totalmente estilizável com gradientes SVG (`linearGradient`) e classes Tailwind CSS.
  - Suporte nativo a tooltips interativos no hover.
- **Decisão:** **Aprovada.**

---

## 3. Estratégia de Coleta e Agregação

Para o HupFlow:
- Snapshots periódicos por post são persistidos na tabela `post_analytics`.
- O endpoint `/api/analytics` faz a leitura desses registros, agrupando por data (`recorded_at::date`) e gerando um payload unificado contendo KPIs, séries temporais e ranking de posts.
- Em desenvolvimento local, se a organização não tiver histórico de postagens publicadas, um gerador de séries demonstrativas fornece dados para validação visual rica sem falhas.

---

## 4. Referências

- Meta Graph API Insights (Instagram & Threads)
- LinkedIn Marketing API - Analytics Finder
- Postiz Legacy Analytics Contract: `_reversa_sdd/postiz-backend-api/contracts.md`
