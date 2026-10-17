# Regression Watch: 036-hupflow-competitor-benchmark-radar

## Watchpoints Ativos
- **W076 (Divisão por Zero no Cálculo de Share of Voice)**:
  - **Risco**: Caso todos os concorrentes filtrados e a linha de base da organização tenham alcance engajado igual a zero (`totalMarketReach === 0`), uma divisão direta produziria `NaN`.
  - **Mitigação**: `calculateShareOfVoiceDistribution` em `hupflow/src/lib/competitors/competitors.test.ts` protege explicitamente contra `totalMarketReach <= 0`, retornando `100%` para a marca e `0%` para os concorrentes.
- **W077 (Deduplicação Case-Insensitive de Content Gaps)**:
  - **Risco**: Tópicos já cobertos pelo workspace poderiam aparecer como lacuna caso tivessem diferenças de capitalização ou espaços extras.
  - **Mitigação**: `detectContentGaps` normaliza todos os tópicos via `.trim().toLowerCase()` tanto para o conjunto `coveredTopics` do workspace quanto para deduplicação entre múltiplos concorrentes (`seenTopics`).
