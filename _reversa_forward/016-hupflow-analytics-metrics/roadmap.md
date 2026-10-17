# Roadmap: Dashboard de Analytics & Métricas Sociais

> Identificador: `016-hupflow-analytics-metrics`  
> Data: `2026-10-16`  
> Requirements: `_reversa_forward/016-hupflow-analytics-metrics/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem técnica implementa um subsistema analítico completo dividido em 4 camadas principais:
1. **Modelo Relacional de Métricas (`post_analytics`):** Tabela em `schema.ts` para armazenar snapshots de desempenho por publicação e rede social (`impressions`, `reach`, `likes`, `comments`, `shares`, `clicks`, `engagementRate`, `recordedAt`).
2. **Motor de Agregação e Cálculos (`calculator.ts`):** Módulo com funções puras e determinísticas para:
   - Cálculo da taxa de engajamento percentual com precisão decimal.
   - Agregação de séries temporais diárias com preenchimento contínuo de datas vazias.
   - Distribuição de volume e engajamento por canal (Instagram, Threads, LinkedIn, X).
   - Ordenação e filtragem das principais publicações por alcance ou engajamento.
3. **Endpoint REST de Métricas (`/api/analytics`):**
   - Rota autenticada protegida com `requireOrgRole(req, 'viewer')`.
   - Suporte a filtros de intervalo (`7d`, `30d`, `90d`) e filtragem por rede (`provider`).
   - Modo de fallback demonstrativo integrado para contas recém-criadas em ambiente de desenvolvimento local.
4. **Interface Visual Responsiva (`/analytics`):**
   - 4 Cartões KPI com micro-indicadores e tendências comparativas.
   - Gráfico vetorial SVG interativo (área e linha) com gradientes modernos, sem bibliotecas pesadas externas.
   - Barras de progresso e engajamento por canal conectado.
   - Tabela de Melhores Publicações com miniaturas, taxa de engajamento e contagem de interações.
   - Atalho integrado na barra lateral do dashboard.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|:------:|
| **Zero Contaminação AGPL / Clean-Room** | Visualização de gráficos construída exclusivamente com React 19, SVG vetorial nativo e Tailwind CSS, sem bibliotecas externas proprietárias ou sob licenças de risco. | Respeita 🟢 |
| **Isolamento Multi-Tenant Estrito** | Toda busca de métricas é isolada obrigatoriamente pela cláusula `eq(postAnalytics.organizationId, auth.organizationId)`. | Respeita 🟢 |
| **Performance e Baixa Latência** | Cálculos matemáticos em memória otimizados e agregações indexadas por data. | Respeita 🟢 |
| **Experiência Visual de Alto Padrão** | Design Dark Premium com glassmorphism, tooltips, gradientes suaves e feedback instantâneo de carregamento. | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|:-----------:|
| **D-01** | Gráficos vetoriais em SVG nativo em vez de Chart.js / Recharts | Evita dependências pesadas no bundle client-side, elimina conflitos com React 19 e confere controle estilístico absoluto via classes do Tailwind CSS. | Adicionar Chart.js ou Recharts (maior peso e problemas comuns de hidratação no SSR). | 🟢 |
| **D-02** | Base 10000 para taxa de engajamento no banco (ex: 350 = 3.5%) | Permite armazenamento inteiro no Postgres sem erros de arredondamento de float. | Decimal / Float solto no banco. | 🟢 |
| **D-03** | Gerador de séries temporais contínuas preenchendo dias sem postagem com zero | Garante que o eixo X do gráfico seja uniforme e não sofra deformações visuais em intervalos sem publicações. | Deixar buracos nas datas (gráfico quebrado). | 🟢 |
| **D-04** | Fallback com dados demonstrativos em `NODE_ENV === 'development'` | Permite validação visual rica imediata na interface mesmo antes de sincronizar contas sociais reais da Meta/LinkedIn. | Retornar tudo zerado (experiência visual pobre em testes). | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| As redes sociais suportadas são instagram, threads, linkedin e x | `requirements.md#2` | Baixo; alinhado com `socialAccounts.provider`. |
| Qualquer membro (`viewer` a `owner`) tem permissão de leitura sobre métricas | `requirements.md#RN-05` | Baixo; regra confirmada em `permissions.md`. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|------------|---------------------------|:---------------:|--------|
| `post_analytics` | `_reversa_sdd/erd-complete.md` | Componente Novo | Tabela Drizzle para persistência de métricas e snapshots de posts. |
| `types.ts` (analytics) | `_reversa_sdd/sdd/05-scheduler-engine.md` | Componente Novo | Tipos TypeScript para KPIs, séries temporais e breakdowns. |
| `calculator.ts` | `_reversa_sdd/sdd/05-scheduler-engine.md` | Componente Novo | Motor puro de agregação e cálculos matemáticos de métricas. |
| `calculator.test.ts` | `_reversa_sdd/sdd/05-scheduler-engine.md` | Componente Novo | Suíte de testes unitários para o motor de cálculos. |
| `/api/analytics/route.ts` | `_reversa_sdd/postiz-backend-api/contracts.md` | Componente Novo | Endpoint REST para consulta agregada com filtros. |
| `/analytics/page.tsx` | `_reversa_sdd/prd.md` | Componente Novo | Dashboard interativo de métricas sociais. |
| `layout.tsx` | `_reversa_sdd/prd.md` | Modificado | Inclusão do link "Analytics" na barra lateral de navegação. |

---

## 6. Delta no modelo de dados

Adição da tabela `post_analytics` em `schema.ts`. Detalhe completo em: `_reversa_forward/016-hupflow-analytics-metrics/data-delta.md`.

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| API de Analytics e Métricas | HTTP REST | `_reversa_forward/016-hupflow-analytics-metrics/interfaces/analytics-api.md` |

---

## 8. Plano de migração / rollout

1. Adicionar a definição da tabela em `schema.ts`.
2. A API verifica a existência e aplica fallback seguro se a tabela ainda não estiver populada.

---

## 9. Riscos e contingências

| Risco | Impacto | Probabilidade | Mitigação |
|-------|:-------:|:-------------:|-----------|
| Divisão por zero em posts sem alcance | Médio | Média | Função de cálculo `calculateEngagementRate` valida `reach > 0` e retorna 0 caso contrário. |
| Período temporal longo (90d) com muitas linhas | Médio | Baixa | Agregação SQL agrupada por data e canal para limitar retorno a no máximo 90 registros na série. |

---

## 10. Critério de pronto

- [ ] Tabela `postAnalytics` criada em `schema.ts`.
- [ ] Funções de cálculo testadas e 100% aprovadas via `calculator.test.ts`.
- [ ] Endpoint `/api/analytics` operacional com suporte a filtros e proteção multi-tenant.
- [ ] Dashboard `/analytics` funcional com cartões de KPI, gráfico SVG responsivo e ranking de posts.
- [ ] Navegação integrada na barra lateral do dashboard.
- [ ] Compilação `tsc --noEmit` finalizada com 0 erros.
