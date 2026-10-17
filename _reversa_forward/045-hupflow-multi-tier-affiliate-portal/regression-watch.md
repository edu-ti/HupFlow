# Watchpoints de Regressão — Feature 045: Portal de Afiliados & Parcerias com Comissionamento Recorrente

## Pontos Críticos Monitorados

### `W094: Validação Matemática de Saldo Disponível para Saques (Double-Spending Prevention)`
- **Contexto**: A liquidação de comissões precisa subtrair com exatidão o saldo disponível do parceiro sem permitir saques acima do montante acumulado.
- **Risco**: Se houver race condition ou cálculo inconsistente, a agência/plataforma pode registrar pagamentos em duplicidade.
- **Mitigação**: O método `processPartnerPayout` limita o valor a `Math.min(partner.availableBalanceBrl, Math.max(0, amountBrl))` e atualiza o estado de forma atômica no banco de dados.

### `W095: Unicidade e Sanitização do Código de Referência (Referral Code)`
- **Contexto**: O código do afiliado compõe a URL de conversão e cupom.
- **Risco**: Caracteres especiais ou códigos em minúsculo podem quebrar rotas ou matching de campanhas.
- **Mitigação**: O código é sanitizado com `toUpperCase().replace(/[^A-Z0-9]/g, '')`, garantindo URLs previsíveis e imunes a injeção ou caracteres ambíguos.
