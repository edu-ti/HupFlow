# Investigation: 040-hupflow-employee-advocacy-board

## Contexto Arquitetural
- Perfis pessoais de colaboradores e executivos no LinkedIn e X geram até **5x mais taxa de engajamento** e **8x mais alcance orgânico** do que páginas corporativas (Company Pages), onde o custo por clique (CPC) em mídia paga B2B frequentemente ultrapassa R$ 6,00 a R$ 12,00.
- A **Feature 040 (`040-hupflow-employee-advocacy-board`)** equipa o HupFlow com um **Mural de Employee Advocacy & Gamificação**, resolvendo os dois maiores obstáculos de programas internos:
  1. **Penalização Algorítmica por Copy Duplicado**: quando 20 funcionários copiam e colam exatamente o mesmo texto, o algoritmo do LinkedIn reduz o alcance. Nossa função `generateAdvocacyPersonaVariations` gera 3 ângulos em primeira pessoa (*Visão Executiva*, *Bastidores Técnicos/Produto* e *Consultivo/Mercado*).
  2. **Mensuração de Retorno Financeiro (Ad Spend Saved)**: converte cada compartilhamento e clique orgânico gerado pelo time em reais economizados de mídia paga (`adSpendSavedBrl`).

## Decisões de Design Clean-Room
1. **Fórmula de Economia de Mídia Paga (`adSpendSavedBrl`)**:
   - $\text{AdSpendSaved} = \text{round}\left(\frac{\text{organicReach}}{1000} \times 38 + \text{estimatedClicks} \times \text{channelCpcBrl}\right)$, onde `channelCpcBrl` é `6.5` para `linkedin` e `3.2` para `instagram` / `x`.
2. **Sistema de Pontos e Badges**:
   - Cada campanha define `pointsReward` (ex: `50` a `100` pts). Ao clicar em **Compartilhar & Pontuar**, a campanha incrementa `sharesCount`, recalcula `adSpendSavedBrl` e atualiza os pontos do colaborador no Leaderboard.
