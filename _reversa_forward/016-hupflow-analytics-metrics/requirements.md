# Requirements: Dashboard de Analytics & Métricas Sociais

> Identificador: `016-hupflow-analytics-metrics`  
> Data: `2026-10-16`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta feature implementa o painel unificado de métricas analíticas e performance social do HupFlow.
Ela consolida e apresenta indicadores-chave de desempenho (impressões, alcance, curtidas, comentários, compartilhamentos e taxa média de engajamento) de todas as postagens publicadas pelas redes sociais conectadas (Instagram, Threads, LinkedIn e X), permitindo filtros por período temporal (7d, 30d, 90d) e por canal. No frontend, entrega uma experiência analítica completa em Dark Mode em `/analytics` com gráficos de tendência diária, distribuição de engajamento por rede e ranking das melhores publicações.

---

## 2. Contexto a partir do legado e specs SDD

| Fonte | Trecho relevante | Confidência |
|-------|------------------|:-----------:|
| `_reversa_sdd/adrs/0005-unified-social-abstract-connector-layer.md` | "Todo conector implementa a mesma interface comum: post(), refreshToken(), analytics()." | 🟢 |
| `_reversa_sdd/postiz-backend-api/contracts.md` | "GET /v1/analytics: Obter métricas de engajamento por período e conta conectada." | 🟢 |
| `_reversa_sdd/permissions.md` | "VIEWER e MEMBER possuem acesso liberado para visualização de métricas e dashboards analíticos." | 🟢 |
| `_reversa_sdd/prd.md#escopo-mvp` | "Métricas & Analytics: Visualização de performance de posts publicados e engajamento consolidado." | 🟢 |
| `hupflow/src/lib/db/schema.ts` | Tabelas `posts`, `post_channels` e `social_accounts` prontas para receber agregação de métricas. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Eduardo (Admin / Gestor de Marketing)** | Analisar o ROI das campanhas sociais dos clientes e identificar quais carrosséis e formatos geram maior taxa de engajamento. | Acessa `/analytics`, seleciona o período "Últimos 30 dias", visualiza o gráfico de crescimento de alcance e identifica o carrossel campeão no ranking de posts. |
| **Beatriz (Criadora de Conteúdo)** | Verificar se os posts agendados na semana anterior atingiram a meta de comentários e curtidas. | Filtra por canal "Instagram", confere a taxa média de engajamento (3.8%) e ajusta os temas dos próximos carrosséis com base no feedback quantitativo. |
| **Carlos (Cliente / Viewer)** | Acompanhar a evolução das métricas do seu workspace em modo somente leitura. | Acessa a aba de Analytics para auditar o progresso da agência sem possibilidade de alterar configurações. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Isolamento Multi-Tenant em Métricas):** As consultas de analytics filtram estritamente pelo `organizationId` ativo da sessão. É expressamente proibido expor métricas de posts pertencentes a outras organizações. 🟢
2. **RN-02 (Cálculo Padronizado de Taxa de Engajamento):** A taxa de engajamento é calculada como `((curtidas + comentários + compartilhamentos) / alcance) * 100`. Caso o alcance seja 0, a taxa é computada como 0% para evitar divisão por zero. 🟢
3. **RN-03 (Filtros Temporais Suportados):** O dashboard suporta 3 janelas temporais canônicas: `7d` (últimos 7 dias), `30d` (últimos 30 dias) e `90d` (últimos 90 dias). 🟢
4. **RN-04 (Fallback Gracioso para Contas Novas / Dev):** Quando uma organização ainda não tiver postagens publicadas ou métricas externas coletadas, o endpoint de analytics deve fornecer uma estrutura de dados consistente (zeros ou dados demonstrativos em ambiente de desenvolvimento local), garantindo que os gráficos e cartões nunca quebrem na interface. 🟢
5. **RN-05 (Acesso por Papel RBAC):** Todos os papéis da organização (`owner`, `admin`, `member`, `viewer`) possuem permissão de leitura sobre as métricas analíticas. 🟢

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|:----------:|--------------------|:-----------:|
| **RF-01** | Modelo de dados `post_analytics` em `schema.ts`. | Must | Tabela Drizzle mapeando métricas por post e canal (`impressions`, `reach`, `likes`, `comments`, `shares`, `clicks`, `engagementRate`, `recordedAt`). | 🟢 |
| **RF-02** | Utilitário puro de cálculos e agregação (`hupflow/src/lib/analytics/calculator.ts`). | Must | Funções para cálculo de taxa de engajamento, agregação diária de séries e ordenação de top posts, com testes unitários automatizados. | 🟢 |
| **RF-03** | Rota de API REST (`GET /api/analytics`). | Must | Retorna KPIs consolidados, séries temporais para gráficos, percentual por canal e top publicações com base em `range` e `provider`. | 🟢 |
| **RF-04** | Painel visual de Analytics (`/analytics`). | Must | Página em Dark Mode com 4 KPI Cards, seletor de período e rede, gráfico de evolução temporal, barras de distribuição por rede e tabela de melhores posts. | 🟢 |
| **RF-05** | Navegação no Dashboard (`layout.tsx`). | Must | Inclusão do link "Analytics & Métricas" na barra lateral de navegação com ícone representativo. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|:-----------:|
| **Desempenho** | Tempo de resposta de agregação inferior a 50ms para até 10.000 registros agregados. | Consultas indexadas por `organization_id` e `recorded_at`. | 🟢 |
| **Independência Tecnológica (Clean-Room)** | Visualização de gráficos com SVG e CSS puros, eliminando bibliotecas pesadas ou com riscos de licenciamento. | Renderização vetorial nativa e responsiva em React 19. | 🟢 |
| **Design Visual** | Estética Dark Premium alinhada ao HupFlow com micro-interações, tooltips e gradientes elegantes. | Tailwind CSS Dark Mode padronizado. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Consulta de analytics por período de 30 dias
  Dado que um usuário autenticado no workspace "org_alfa" acessa GET /api/analytics?range=30d
  Então o servidor retorna HTTP 200 contendo kpis, dailySeries de 30 pontos e channelBreakdown
  E nenhum dado de outras organizações é vazado na resposta

Cenário: Organização sem histórico de postagens
  Dado que uma organização acabou de ser criada e não tem posts publicados
  Quando o usuário acessa /analytics
  Então a interface exibe estado vazio elegante ou dados de demonstração sem gerar erros no console
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|:------:|---------------|
| **RF-01 & RF-02 (Modelo & Calculadora)** | Must | Base matemática e estrutural de persistência das métricas. |
| **RF-03 (API /api/analytics)** | Must | Fornecimento seguro de dados agregados ao cliente. |
| **RF-04 (Página /analytics)** | Must | Interface principal para consulta e tomada de decisão dos gestores. |
| **RF-05 (Link no menu)** | Must | Acesso canônico no dashboard. |

---

## 9. Esclarecimentos

> Nenhuma dúvida pendente. A estrutura de agregação de métricas segue a padronização do SDD e contratos REST.

---

## 10. Lacunas

*(Nenhuma dúvida impeditiva registrada)*

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Versão inicial gerada por `/reversa-requirements` | reversa-requirements |
