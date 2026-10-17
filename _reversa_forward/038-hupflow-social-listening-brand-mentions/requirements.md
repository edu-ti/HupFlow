# Requirements: 038-hupflow-social-listening-brand-mentions

## Objetivo
Implementar o **Monitor de Social Listening, Menções Indiretas & Alertas de Crise/Tendências em Tempo Real** no HupFlow Clean-Room (`hupflow/**`), permitindo que agências, criadores e marcas rastreiem menções diretas e indiretas (sem `@tag`), palavras-chave do setor e dores de clientes em múltiplas redes (`x`, `linkedin`, `instagram`, `reddit`, `youtube`), classificando sentimento, calculando o **Score de Urgência de RP / Crise (0-100)**, detectando **Anomalias de Sentimento / Picos de Crise** e gerando **Playbooks de Resposta Estratégica IA** (Mitigação de Crise, Social Selling Consultivo ou Amplificação de Advocacia).

## Requisitos Funcionais
- **RF-038-01 (Monitoramento Multi-Tenant de Menções & Keywords)**: Registrar, listar, filtrar por categoria (`brand_mention`, `competitor_complaint`, `industry_trend`, `crisis_risk`), atualizar status (`open`, `engaged`, `resolved`, `ignored`) e excluir sinais de Social Listening isolados por `organizationId`.
- **RF-038-02 (Classificador Léxico de Sentimento & Urgência de RP)**: Função determinística `analyzeMentionSignal` que avalia o texto da menção, o alcance do autor (`authorFollowers`) e a velocidade de engajamento (`velocityPerHour`) para atribuir:
  - `sentiment`: `'positive' | 'neutral' | 'negative'` e `sentimentScore` (`-100` a `+100`)
  - `urgencyScore` (`0` a `100`) e `crisisLevel` (`'normal' | 'watch' | 'elevated' | 'critical_crisis'`)
- **RF-038-03 (Detector de Anomalias de Sentimento & Saúde da Marca — Net Sentiment Score)**: Função `evaluateBrandHealthAndCrisisRadar` que calcula o **Net Sentiment Score (NSS)** (`-100` a `+100`), o percentual de menções negativas de alta velocidade e dispara alerta de crise quando o limiar de risco é ultrapassado.
- **RF-038-04 (Gerador de Playbook de Resposta Estratégica IA)**: Função `generateStrategicResponsePlaybook` que sintetiza a resposta pública ideal e a ação recomendada de RP conforme a categoria e o sentimento da menção (ex: contenção empática para `crisis_risk`, abordagem consultiva sem spam para `competitor_complaint`, ou agradecimento + pedido de permissão UGC para `brand_mention` positiva).
- **RF-038-05 (Painel Visual de Social Listening & Radar de Crise)**: Página `/settings/listening` com banner de saúde da marca (Net Sentiment Score, Alertas Críticos, Oportunidades de Social Selling em Concorrentes), cards interativos (`ListeningMentionCard.tsx`) com cópia de resposta estratégica em 1 clique e formulário de ingestão/simulação de novo sinal.

## Requisitos Não-Funcionais
- **RNF-038-01 (Clean-Room & Zero Dependências Externas)**: Motor heurístico de análise de sentimento e risco de RP 100% em TypeScript puro (zero dependências AGPL).
- **RNF-038-02 (Isolamento Multi-Tenant & RBAC)**: `requireOrgRole(req, 'viewer')` para leitura do monitor (`GET /api/listening`) e `requireOrgRole(req, 'member')` para registro, engajamento ou resolução (`POST /api/listening`, `POST /api/listening/action`).
- **RNF-038-03 (Resiliência com Fallback em Memória)**: Tabela Drizzle `social_listening_mentions` com fallback automático em memória pré-populado com 4 sinais realistas (menção orgânica de fã, reclamação de cliente de concorrente, risco de crise técnica e tendência viral do nicho).
