# Interfaces de UI — Feature 045: Portal de Afiliados & Parcerias com Comissionamento Recorrente

## 1. Card de Parceiro Afiliado `AffiliatePartnerCard.tsx`
- Badge visual de nível com gradientes temáticos:
  - Bronze: 20% (Bronze metálico)
  - Silver: 25% (Prata reluzente)
  - Gold: 30% (Ouro brilhante)
  - Diamond: 40% (Azul diamante ciano)
- URL de indicação com botão de cópia em 1 clique (`https://hupflow.com/r/:code`).
- Estatísticas individuais: Clientes Ativos, MRR Gerado (R$), Comissões Pagas, Saldo Disponível para Saque.
- Botão "Liquidar Saque (Pix)" com modal de confirmação.

## 2. Painel Executivo do Programa de Parcerias (`/settings/affiliates`)
- Barra de KPIs do Programa:
  - MRR Recorrente Gerado por Afiliados (R$)
  - Total Pago em Comissões (R$)
  - Saldo Pendente de Liquidação (R$)
  - Parceiros Ativos na Rede
  - Taxa Média de Retenção de Clientes Indicados (%)
- Tabela / grid de parceiros com filtros rápidos por Tier e busca por nome ou código.
- Modal de cadastro de novo parceiro.
