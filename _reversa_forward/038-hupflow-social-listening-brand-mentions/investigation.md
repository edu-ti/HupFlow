# Investigation: 038-hupflow-social-listening-brand-mentions

## Contexto Arquitetural
- Enquanto a **Feature 034 (`034-hupflow-social-inbox-unified`)** gerencia comentários diretos nas publicações da própria organização, marcas e agências perdem até 70% das conversas relevantes que acontecem **fora** das suas próprias postagens: menções sem `@tag`, discussões em comunidades (`reddit`, `x`, `linkedin`), reclamações públicas sobre ferramentas concorrentes (oportunidades de *Social Selling*) e princípios de crise de relações públicas.
- A **Feature 038 (`038-hupflow-social-listening-brand-mentions`)** preenche essa lacuna estratégica com um motor Clean-Room de **Social Listening & Radar de Crise**.

## Decisões de Design Clean-Room
1. **Cálculo de Urgência de RP (`urgencyScore` 0–100)**:
   - Combina 3 vetores:
     1. **Polaridade Negativa / Risco Léxico** (palavras-chave de falha, cobrança indevida, queda de serviço, reclamação grave): até `45` pontos.
     2. **Autoridade do Autor (`authorFollowers`)**: escala logarítmica até `25` pontos.
     3. **Velocidade de Propagação (`velocityPerHour` — interações/hora)**: até `30` pontos.
   - Sinais com `urgencyScore >= 75` e sentimento negativo são classificados como `critical_crisis`.
2. **Net Sentiment Score (NSS)**:
   - Calculado como $\text{NSS} = \text{round}\left(\frac{\text{Positivas} - \text{Negativas}}{\text{Total}} \times 100\right)$, variando de `-100` a `+100`.
3. **Playbooks Acionáveis por Intenção**:
   - Cada sinal já traz `strategicPlaybook` com `recommendedAction` e `suggestedPublicReply` pronta para copiar ou marcar como respondida (`engaged` / `resolved`).
