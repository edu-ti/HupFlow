# Regression Watch: 037-hupflow-campaign-ab-testing-hooks

## Watchpoints Ativos
- **W078 (Falsos Positivos Estatísticos em Amostras Pequenas)**:
  - **Risco**: Declarar uma variante vencedora prematuramente com poucas impressões (ex: 10 impressões e 3 conversões) geraria decisões incorretas de campanha.
  - **Mitigação**: `evaluateAbExperimentStatistics` em `hupflow/src/lib/ab-testing/ab-testing.test.ts` exige simultaneamente `hasMinSample === true` (`nA >= minSampleSize && nB >= minSampleSize`) e `confidencePct >= targetConfidencePct` para definir `isStatisticallySignificant = true`.
- **W079 (Degeneração do Erro Padrão Agrupado quando $p_{pool} \in \{0, 1\}$)**:
  - **Risco**: Quando a soma das conversões é zero (`cA + cB === 0`) ou igual ao total de impressões (`cA + cB === nA + nB`), o erro padrão agrupado $SE$ torna-se zero, causando divisão por zero no cálculo do Z-Score.
  - **Mitigação**: Guarda explícita retorna `zScore: 0`, `confidencePct: 0` e `recommendedOutcome: 'keep_testing'` antes da divisão.
