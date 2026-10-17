# Regression Watch: 039-hupflow-influencer-creator-crm

## Watchpoints Ativos
- **W082 (Divisão por Zero em CPE/CPM durante Estágio de Prospecção)**:
  - **Risco**: Criadores recém-cadastrados em fase de prospecção podem ter `totalViews === 0` e `totalEngagements === 0`, o que causaria `Infinity` no cálculo de CPE (`agreedFeeBrl / totalEngagements`) e CPM.
  - **Mitigação**: `evaluateCreatorFinancialMetrics` em `hupflow/src/lib/creators/creators.test.ts` verifica explicitamente `engagements > 0` e `views > 0`, retornando o cachê nominal como teto seguro quando ainda não há interações registradas.
- **W083 (Promoção Automática para Estágio `published` ao Concluir Entregáveis)**:
  - **Risco**: Ao registrar entregáveis via `log_deliverable`, o contador `deliverablesCompleted` não deve ultrapassar `deliverablesTotal`.
  - **Mitigação**: `mutateCreatorPartnership` aplica `Math.min(target.deliverablesTotal, target.deliverablesCompleted + 1)` e promove automaticamente `stage = 'published'` quando `nextCompleted >= target.deliverablesTotal`.
