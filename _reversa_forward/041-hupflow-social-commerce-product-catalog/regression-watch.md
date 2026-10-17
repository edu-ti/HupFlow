# Regression Watch: 041-hupflow-social-commerce-product-catalog

## Watchpoints Ativos
- **W086 (Divisão por Zero no Cálculo de RPM Social e EPC com Cliques Nulos)**:
  - **Risco**: Produtos recém-adicionados ao catálogo sem histórico de visualizações ou cliques causariam `NaN` ou `Infinity` nas métricas de conversão e receita por mil impressões.
  - **Mitigação**: `evaluateSocialCommerceMetrics` em `hupflow/src/lib/commerce/commerce.test.ts` verifica explicitamente `clicks > 0` e `impressions > 0`, retornando zero como valor padrão.
- **W087 (Formatação Segura de SKU e URLs Parametrizadas Shoppable)**:
  - **Risco**: SKUs com caracteres especiais poderiam quebrar atributos ou gerar URLs inválidas de rastreamento.
  - **Mitigação**: `createSocialCommerceProduct` sanitiza o SKU com `.toUpperCase()` e gera identificador canônico `HUP-XXXX` caso não informado.
