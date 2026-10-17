# Investigation: 036-hupflow-competitor-benchmark-radar

## Contexto Arquitetural
- As features anteriores (`032` a `035`) consolidaram a camada criativa e de retenção de conteúdo (legendas animadas, portais white-label de aprovação, Social Inbox com IA e cofre de reciclagem Evergreen).
- O próximo passo estratégico de inteligência de marketing no HupFlow é o **Radar de Benchmarking & Inteligência Competitiva** (`036-hupflow-competitor-benchmark-radar`), permitindo responder:
  1. Qual é o nosso *Share of Voice* (SoV) orgânico frente aos principais players do nosso nicho?
  2. Nossa cadência semanal e taxa de engajamento estão acima ou abaixo da linha de corte do setor?
  3. Quais temas e formatos (`carousel`, `reel_video`, `text_thread`, `infographic`) estão gerando tração nos concorrentes e ainda não foram explorados pela nossa marca (*Content Gap Analysis*)?

## Decisões de Design Clean-Room
1. **Fórmula de Share of Voice Orgânico Ponderado**:
   - Em vez de depender apenas do número bruto de seguidores (que pode conter audiência inativa), calculamos o **Volume Semanal de Engajamento Estimado** (`weeklyEngagedReach = Math.round(followersCount * (engagementRatePct / 100) * postsPerWeek)`).
   - O *Share of Voice* (%) de cada player (incluindo o próprio workspace) é `playerWeeklyEngagedReach / totalMarketWeeklyEngagedReach * 100`.
2. **Threat Score (0–100)**:
   - Combina taxa de engajamento (`0..40` pts), cadência semanal (`0..30` pts) e velocidade de crescimento em 30 dias (`0..30` pts) para classificar concorrentes em `low`, `moderate`, `high` ou `critical`.
3. **Motor Determinístico de Content Gaps**:
   - Analisa os tópicos (`topTopics`) dos concorrentes cujo `engagementRatePct` supera a média do nicho e identifica tópicos ausentes no portfólio recente da organização, gerando ganchos criativos prontos para uso no Compositor ou no Estúdio de Carrosséis.
