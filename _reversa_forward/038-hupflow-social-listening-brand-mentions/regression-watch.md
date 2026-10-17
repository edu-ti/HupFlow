# Regression Watch: 038-hupflow-social-listening-brand-mentions

## Watchpoints Ativos
- **W080 (Escala Logarítmica de Alcance do Autor no Cálculo de Urgência)**:
  - **Risco**: Caso `authorFollowers` seja `0` ou negativo, `Math.log10(authorFollowers)` retornaria `-Infinity` ou `NaN`.
  - **Mitigação**: `analyzeMentionSignal` em `hupflow/src/lib/listening/listening.test.ts` aplica `Math.max(100, input.authorFollowers)` antes de calcular `Math.log10`.
- **W081 (Disparo Indevido de Alerta de Crise por Sinais Já Resolvidos)**:
  - **Risco**: Sinais críticos já resolvidos (`status === 'resolved'`) não devem manter o banner de alerta de crise ativo no topo do dashboard.
  - **Mitigação**: `evaluateBrandHealthAndCrisisRadar` contabiliza em `criticalCrisisCount` apenas menções com `crisisLevel === 'critical_crisis' && status === 'open'`.
