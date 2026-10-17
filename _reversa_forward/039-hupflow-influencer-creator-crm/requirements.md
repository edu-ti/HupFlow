# Requirements: 039-hupflow-influencer-creator-crm

## Objetivo
Implementar o **Hub de Parcerias, Influenciadores & UGC (Creator CRM, Tracking de Entregáveis e Cálculo de ROI / CPE / EMV por Criador)** no HupFlow Clean-Room (`hupflow/**`), permitindo que agências, marcas e equipes de growth gerenciem parcerias com influenciadores e criadores UGC em múltiplas redes (`instagram`, `tiktok`, `youtube`, `linkedin`), acompanhem o progresso dos entregáveis contratados (`deliverablesCompleted / deliverablesTotal`) e calculem automaticamente indicadores financeiros determinísticos: **CPE (Cost Per Engagement)**, **CPM Efetivo**, **EMV (Earned Media Value)** e **ROI da Parceria (%)**, além de gerar **Briefings de Campanha UGC IA** prontos para envio ao criador.

## Requisitos Funcionais
- **RF-039-01 (CRM Multi-Tenant de Criadores & Influenciadores)**: Cadastrar, listar, filtrar por estágio (`prospecting`, `negotiating`, `contracted`, `content_review`, `published`), atualizar métricas de entregáveis e excluir criadores isolados por `organizationId`.
- **RF-039-02 (Motor Financeiro de CPE, EMV & ROI de Influenciadores)**: Função determinística `evaluateCreatorFinancialMetrics` que calcula:
  - **Custo por Engajamento (`cpeBrl`)**: `agreedFeeBrl / totalEngagements`
  - **CPM Efetivo (`cpmBrl`)**: `(agreedFeeBrl / totalViews) * 1000`
  - **Earned Media Value (`emvBrl`)**: Valor equivalente de mídia paga ponderando visualizações, interações e cliques/conversões rastreadas
  - **ROI da Parceria (`roiPct`)**: `((generatedRevenueBrl + emvBrl - agreedFeeBrl) / agreedFeeBrl) * 100`
  - **Tier de Performance (`performanceTier`)**: `'elite_roi' | 'profitable' | 'break_even' | 'underperforming'`.
- **RF-039-03 (Gerador de Briefing Criativo UGC IA)**: Função `generateCreatorUgcBriefing` que produz um roteiro estruturado em 3 atos (*Gancho 3s*, *Demonstração Nativa*, *CTA com Cupom/UTM*) adaptado ao nicho e canal do criador.
- **RF-039-04 (Tracking de Entregáveis & Simulação de Resultados)**: Endpoint `POST /api/creators/action` que permite registrar novo entregável publicado (incrementando views, engajamentos e receita atribuída), avançar o estágio no pipeline CRM ou remover o registro.
- **RF-039-05 (Painel Visual do Creator CRM & Calculadora ROI)**: Página `/settings/creators` com 4 KPI Cards (Investimento Total vs Receita+EMV, ROI Médio da Carteira, CPE Médio, Entregáveis Concluídos), cards analíticos (`CreatorPartnershipCard.tsx`) com cópia de Briefing UGC em 1 clique e formulário de adição de novo parceiro.

## Requisitos Não-Funcionais
- **RNF-039-01 (Clean-Room & Zero Dependências Externas)**: Cálculos financeiros e gerador de briefing 100% em TypeScript puro (zero dependências AGPL).
- **RNF-039-02 (Isolamento Multi-Tenant & RBAC)**: `requireOrgRole(req, 'viewer')` para leitura (`GET /api/creators`) e `requireOrgRole(req, 'member')` para cadastro e mutações (`POST /api/creators`, `POST /api/creators/action`).
- **RNF-039-03 (Resiliência com Fallback em Memória)**: Tabela Drizzle `influencer_partnerships` com fallback automático em memória pré-populado com 3 criadores/influenciadores realistas.
