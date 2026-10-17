# Requirements: 040-hupflow-employee-advocacy-board

## Objetivo
Implementar o **Programa de Employee Advocacy & Amplificação de Equipe (Gamificação, Leaderboard & Economia de Mídia Paga)** no HupFlow Clean-Room (`hupflow/**`), permitindo que empresas, agências e equipes B2B publiquem campanhas pré-aprovadas no mural interno para que colaboradores compartilhem em seus perfis pessoais (`linkedin`, `instagram`, `x`) com **variações personalizadas por perfil de cargo** (*Executivo/Liderança*, *Especialista Técnico*, *Consultor Comercial*), contabilizando pontos de gamificação, ranking (*Leaderboard*) e calculando o **Ad Spend Saved (Economia Equivalente de Mídia Paga em R$)**.

## Requisitos Funcionais
- **RF-040-01 (Mural Multi-Tenant de Campanhas de Advocacy)**: Criar, listar, filtrar por departamento/canal, registrar compartilhamentos de colaboradores e excluir campanhas de Employee Advocacy isoladas por `organizationId`.
- **RF-040-02 (Gerador IA de Variações por Persona do Colaborador)**: Função determinística `generateAdvocacyPersonaVariations` que transforma a mensagem oficial da marca em 3 versões autênticas em 1ª pessoa (`executive_vision`, `technical_builder`, `sales_advisor`) para evitar textos robóticos duplicados no feed do LinkedIn/X.
- **RF-040-03 (Motor de Economia de Mídia Paga — Ad Spend Equivalent & Gamificação)**: Função `calculateAdvocacyImpactMetrics` que calcula:
  - Alcance orgânico acumulado (`totalOrganicReach = sharesCount * avgReachPerShare`)
  - Cliques qualificados (`totalClicks`)
  - **Ad Spend Saved (R$)**: Economia equivalente de anúncios considerando CPC médio B2B/Social (`R$ 6,50` no LinkedIn, `R$ 3,20` no Instagram/X) + CPM orgânico (`R$ 38,00 / 1k impressões`).
- **RF-040-04 (Leaderboard Gamificado de Embaixadores Internos)**: Ranking automático de colaboradores (`AdvocacyLeaderboardMember`) com pontuação (`points`), insígnia (`badge`: `'Diamond Ambassador' | 'Gold Voice' | 'Rising Star'`), compartilhamentos e alcance gerado.
- **RF-040-05 (Painel Visual de Employee Advocacy & Leaderboard)**: Página `/settings/advocacy` com 4 KPI Cards (Economia em Ads Gerada R$, Alcance Orgânico da Equipe, Total de Compartilhamentos, Embaixadores Ativos), mural de campanhas (`AdvocacyCampaignCard.tsx`) com seletor das 3 personas, cópia em 1 clique + botão **Registrar Meu Compartilhamento (+Pontos)** e Leaderboard lateral.

## Requisitos Não-Funcionais
- **RNF-040-01 (Clean-Room & Zero Dependências Externas)**: Motor de cálculo de Ad Spend Saved, gamificação e variações em 1ª pessoa 100% em TypeScript puro (zero dependências AGPL).
- **RNF-040-02 (Isolamento Multi-Tenant & RBAC)**: `requireOrgRole(req, 'viewer')` para leitura do mural e leaderboard (`GET /api/advocacy`) e `requireOrgRole(req, 'member')` para criação de campanha e registro de compartilhamento (`POST /api/advocacy`, `POST /api/advocacy/share`).
- **RNF-040-03 (Resiliência com Fallback em Memória)**: Tabela Drizzle `advocacy_campaigns` com fallback automático em memória pré-populado com 3 campanhas corporativas e Leaderboard da equipe.
