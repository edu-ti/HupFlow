# Investigation: 041-hupflow-social-commerce-product-catalog

## Contexto Arquitetural
- Após implementar o **Creator CRM (`039`)** e o **Mural de Employee Advocacy (`040`)**, o elo final de monetização direta no HupFlow é o **Catálogo Social Commerce & Atribuição de Receita por Post/Reel** (`041-hupflow-social-commerce-product-catalog`).
- Criadores, SaaS e marcas de e-commerce precisam saber exatamente quanto cada produto marcado em Reels, TikTok Shop, YouTube Shopping ou Carrosséis do LinkedIn gera de **Receita por 1.000 Impressões (RPM Social)** e **Ganho por Clique (EPC)**.

## Decisões de Design Clean-Room
1. **Indicadores de Monetização Direta (`evaluateSocialCommerceMetrics`)**:
   - $\text{Receita Total} = \text{ordersCount} \times \text{priceBrl}$.
   - $\text{Checkout Conversion (\%)} = \frac{\text{ordersCount}}{\max(1, \text{productClicks})} \times 100$.
   - $\text{EPC (R\$)} = \frac{\text{Receita Total}}{\max(1, \text{productClicks})}$.
   - $\text{RPM Social (R\$)} = \frac{\text{Receita Total}}{\max(1, \text{taggedImpressions})} \times 1000$.
2. **Classificação de Velocidade Comercial (`velocityTier`)**:
   - Produtos com `socialRpmBrl >= 450` ou `ordersCount >= 40` recebem selo `bestseller`.
3. **Copy Shoppable Pronta para Publicação**:
   - Cada item do catálogo inclui uma legenda otimizada com gatilho de escassez/benefício e link parametrizado.
