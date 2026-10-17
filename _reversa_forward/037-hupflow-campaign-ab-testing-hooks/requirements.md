# Requirements: 037-hupflow-campaign-ab-testing-hooks

## Objetivo
Implementar o **Laboratório de Testes A/B de Ganchos & Capas de Carrossel (Significância Estatística & Auto-Winner)** no HupFlow Clean-Room (`hupflow/**`), permitindo que agências, criadores e equipes de marketing criem experimentos controlados com 2 variantes (**Variante A — Controle** vs. **Variante B — Desafiante**) para testar primeiras linhas de copy (*hooks*), chamadas para ação (CTAs) ou títulos de capa de carrossel, calculando automaticamente a taxa de conversão/engajamento, o **Lift Relativo (%)**, o **Z-Score de Duas Proporções**, o **Índice de Confiança Estatística (%)** e promovendo a variante vencedora quando o limiar mínimo de amostra e confiança (ex: 95%) for atingido.

## Requisitos Funcionais
- **RF-037-01 (Gestão Multi-Tenant de Experimentos A/B)**: Criar, listar, simular tráfego/amostra, declarar vencedor e encerrar experimentos A/B isolados por `organizationId`.
- **RF-037-02 (Motor Estatístico Z-Score de Duas Proporções)**: Função determinística `evaluateAbExperimentStatistics` que calcula:
  - Taxa de conversão/engajamento de cada variante (`conversionRatePct = conversions / impressions * 100`)
  - Lift relativo da Variante B sobre a Variante A (`relativeLiftPct`)
  - Erro padrão agrupado (*pooled standard error*) e `zScore`
  - Nível de confiança estatística (`confidencePct` de `0` a `99.9%`)
  - Recomendação automática (`keep_testing`, `winner_a`, `winner_b`, `inconclusive`) respeitando tamanho mínimo de amostra por variante (`minSampleSize`, padrão 200 impressões).
- **RF-037-03 (Gerador IA de Variante Desafiante — Hook Challenger)**: Função `generateChallengerHookVariant` que, a partir de um gancho original (Controle A) e de uma hipótese psicológica (`curiosity_gap`, `contrarian_shock`, `social_proof_numbers`, `urgency_fomo`), gera automaticamente o copy/título de capa da Variante B.
- **RF-037-04 (Simulação de Ingestão de Amostra & Auto-Winner)**: Endpoint `POST /api/ab-tests/simulate` que permite incrementar impressões e engajamentos/cliques de um experimento em andamento ou promover manualmente/automaticamente a variante vencedora (`status = 'completed'`, `winningVariantId = 'A' | 'B'`).
- **RF-037-05 (Painel Visual do Laboratório A/B)**: Página `/settings/ab-testing` com KPIs de experimentos ativos, taxa média de Lift das vitórias, confiança média e cards comparativos lado a lado (`AbExperimentCard.tsx`) com medidor visual de significância estatística.

## Requisitos Não-Funcionais
- **RNF-037-01 (Clean-Room & Matemática Nativa)**: Aproximação polinomial de Abramowitz & Stegun para a CDF Normal Padrão implementada em TypeScript puro (zero dependências externas ou AGPL).
- **RNF-037-02 (Isolamento Multi-Tenant & RBAC)**: `requireOrgRole(req, 'viewer')` para consultas (`GET /api/ab-tests`) e `requireOrgRole(req, 'member')` para criação, simulação de amostra ou promoção de vencedor (`POST /api/ab-tests`, `POST /api/ab-tests/simulate`).
- **RNF-037-03 (Resiliência com Fallback em Memória)**: Tabela Drizzle `ab_test_experiments` com fallback automático em memória pré-populado com 3 experimentos realistas em diferentes estágios estatísticos.
