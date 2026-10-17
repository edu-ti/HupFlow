# Requirements: 036-hupflow-competitor-benchmark-radar

## Objetivo
Implementar o **Radar de Benchmarking & Inteligência Competitiva (Share of Voice, Cadência & Análise de Lacunas IA)** no HupFlow Clean-Room (`hupflow/**`), permitindo que agências, criadores e equipes de marketing monitorem perfis concorrentes por rede social e nicho, comparem indicadores-chave (Taxa de Engajamento, Frequência Semanal de Posts, Crescimento de Seguidores, Share of Voice Relativo) contra a linha de base da própria organização e descubram oportunidades inexploradas (*Content Gap Analysis*) com sugestões de pauta acionáveis.

## Requisitos Funcionais
- **RF-036-01 (Cadastro & Monitoramento Multi-Tenant de Concorrentes)**: Permitir adicionar, listar, atualizar métricas e remover perfis de concorrentes (`handle`, `name`, `channel`, `niche`, `followersCount`, `engagementRatePct`, `postsPerWeek`, `growth30dPct`, `topFormat`, `topTopics`) isolados por `organizationId`.
- **RF-036-02 (Cálculo de Share of Voice & Score de Pressão Competitiva)**: Função determinística `calculateShareOfVoice` e `calculateCompetitiveThreatScore` que pondera alcance estimado (`followersCount * engagementRatePct * postsPerWeek`) para distribuir o Share of Voice (%) entre o workspace e os concorrentes monitorados, além de pontuar de 0 a 100 o índice de pressão competitiva de cada rival.
- **RF-036-03 (Comparativo de Linha de Base vs. Média do Nicho)**: Função `compareAgainstWorkspaceBaseline` que compara as métricas da organização com a média ponderada do nicho (`engagementDeltaPct`, `cadenceDeltaPosts`, `growthDeltaPct`, `winningFormatRecommendation`).
- **RF-036-04 (Detecção de Lacunas de Conteúdo — Content Gap Analysis IA)**: Função `detectContentGaps` que cruza os tópicos e formatos dominantes dos concorrentes de alta performance com os tópicos já cobertos pela organização, gerando oportunidades acionáveis (`gapTopic`, `recommendedFormat`, `opportunityScore`, `suggestedHook`, `rationale`).
- **RF-036-05 (Simulação de Sincronização de Snapshot)**: Endpoint `POST /api/competitors/sync` capaz de atualizar instantaneamente o snapshot de métricas e reprocessar o Share of Voice e as lacunas de conteúdo para um concorrente ou para todo o radar da organização.
- **RF-036-06 (Dashboard Visual de Inteligência Competitiva)**: Página `/settings/competitors` com cards de KPIs comparativos (Share of Voice da Marca, Taxa Média do Nicho, Concorrentes Monitorados, Lacunas Detectadas), tabela/grid interativo de concorrentes com barras de Share of Voice, painel de *Content Gap Analysis* com botão de cópia de Hook para o Compositor, e modal/formulário de adição de novo concorrente.

## Requisitos Não-Funcionais
- **RNF-036-01 (Clean-Room & Zero Dependências Proprietárias)**: Motor analítico 100% em TypeScript puro, sem scrapers ilegais ou bibliotecas AGPL.
- **RNF-036-02 (Isolamento Multi-Tenant & RBAC)**: `requireOrgRole(req, 'viewer')` para leitura do radar (`GET /api/competitors`) e `requireOrgRole(req, 'member')` para cadastro, sincronização de snapshot ou remoção (`POST /api/competitors`, `POST /api/competitors/sync`).
- **RNF-036-03 (Resiliência Offline/Demo)**: Persistência Drizzle ORM (`competitor_profiles`) com fallback automático em memória pré-populado com perfis realistas do mercado SaaS/Creator e linha de base da organização.
