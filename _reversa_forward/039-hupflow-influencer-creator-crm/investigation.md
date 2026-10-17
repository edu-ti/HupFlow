# Investigation: 039-hupflow-influencer-creator-crm

## Contexto Arquitetural
- Com o **Radar Competitivo (`036`)**, **Laboratório de Testes A/B (`037`)** e **Social Listening (`038`)** já operacionais, as marcas e agências no HupFlow identificam criadores e defensores orgânicos da marca, mas precisam de um **Creator CRM & Calculadora de ROI/EMV** para gerenciar contratos de UGC (*User-Generated Content*), acompanhar entregáveis e comprovar financeiramente quais influenciadores trazem retorno real.

## Decisões de Design Clean-Room
1. **Fórmula de Earned Media Value (EMV) & ROI em Reais (BRL)**:
   - Sejam `totalViews`, `totalEngagements` e `conversionsCount` os resultados acumulados dos entregáveis publicados pelo criador, e `agreedFeeBrl` o cachê contratado:
   - $\text{EMV} = (\text{totalViews} / 1000) \times 18 + (\text{totalEngagements} \times 0.85)$.
   - $\text{CPE} = \text{agreedFeeBrl} / \max(1, \text{totalEngagements})$.
   - $\text{ROI (\%)} = \frac{(\text{generatedRevenueBrl} + \text{EMV}) - \text{agreedFeeBrl}}{\max(1, \text{agreedFeeBrl})} \times 100$.
2. **Pipeline de Estágios CRM**:
   - `prospecting` $\rightarrow$ `negotiating` $\rightarrow$ `contracted` $\rightarrow$ `content_review` $\rightarrow$ `published`.
3. **Briefing UGC Estruturado**:
   - Cada parceria inclui um briefing gerado por IA (`ugcBriefing`) com código de cupom/UTM exclusivo do criador e estrutura de roteiro nativa para Reels/TikTok/LinkedIn.
