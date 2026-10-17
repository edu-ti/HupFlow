# Regression Watch: 040-hupflow-employee-advocacy-board

## Watchpoints Ativos
- **W084 (Penalização Algorítmica por Texto Duplicado em Employee Advocacy)**:
  - **Risco**: Caso múltiplos colaboradores compartilhem exatamente a mesma string no LinkedIn ou X, o algoritmo reduz o alcance orgânico.
  - **Mitigação**: `generateAdvocacyPersonaVariations` em `hupflow/src/lib/advocacy/advocacy.test.ts` gera obrigatoriamente 3 ângulos distintos em 1ª pessoa (`executive_vision`, `technical_builder`, `sales_advisor`).
- **W085 (Consistência do Ranking Leaderboard Após Compartilhamento)**:
  - **Risco**: Após incrementar os pontos de um colaborador em `mutateAdvocacyCampaign`, o array do Leaderboard poderia ficar fora de ordem decrescente ou com `badge` desatualizado.
  - **Mitigação**: `mutateAdvocacyCampaign` recalcula imediatamente `assignAmbassadorBadge(nextPoints)` e reordena via `.sort((a, b) => b.points - a.points)`.
