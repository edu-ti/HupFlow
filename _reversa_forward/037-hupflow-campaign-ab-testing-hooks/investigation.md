# Investigation: 037-hupflow-campaign-ab-testing-hooks

## Contexto Arquitetural
- Após implementar o **Radar de Benchmarking & Inteligência Competitiva** (`036`), o próximo passo natural no ciclo de otimização de performance do HupFlow é o **Laboratório de Testes A/B de Ganchos & Capas de Carrossel** (`037-hupflow-campaign-ab-testing-hooks`).
- Criadores e agências frequentemente descobrem uma oportunidade de tópico no Radar Competitivo, mas precisam validar qual **gancho de primeira linha** ou **headline de capa de carrossel** converte mais antes de escalar o post ou impulsioná-lo.

## Decisões de Design Clean-Room
1. **Teste Z Bicaudal para Duas Proporções (`pA` vs `pB`)**:
   - Sejam $n_A, c_A$ as impressões e conversões (cliques/engajamentos salvos) da Variante A, e $n_B, c_B$ da Variante B.
   - Proporções: $p_A = c_A / n_A$, $p_B = c_B / n_B$, proporção agrupada $p_{pool} = (c_A + c_B) / (n_A + n_B)$.
   - Erro padrão: $SE = \sqrt{p_{pool}(1 - p_{pool})(1/n_A + 1/n_B)}$.
   - Estatística $Z = (p_B - p_A) / SE$.
   - Confiança bicaudal: $\text{Confidence} = (2 \cdot \Phi(|Z|) - 1) \times 100\%$, onde $\Phi$ é calculada via aproximação de Abramowitz & Stegun (erro $< 7.5 \times 10^{-8}$).
2. **Proteção contra Falsos Positivos Prematuros**:
   - Nenhum experimento declara vencedor automático antes que ambas as variantes atinjam `minSampleSize` (ex: `200` impressões por variante) **e** `confidencePct >= targetConfidencePct` (padrão `95%`).
3. **Gerador Determinístico de Hipóteses Desafiantes**:
   - Permite que o usuário insira apenas o Gancho A e escolha o ângulo psicológico (`curiosity_gap`, `contrarian_shock`, `social_proof_numbers`, `urgency_fomo`) para preencher automaticamente a Variante B.
