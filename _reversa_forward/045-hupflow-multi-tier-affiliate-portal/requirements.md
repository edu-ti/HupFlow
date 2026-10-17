# Requisitos — Feature 045: Portal de Afiliados & Parcerias com Comissionamento Recorrente

## 1. Visão Geral do Módulo
Para alavancar o crescimento orgânico de receitas (Product-Led Growth & Creator Partnerships), o HupFlow necessita de um sistema nativo de **Afiliados & Parceiros Estratégicos** com comissionamento recorrente mensal (MRR Share), links de conversão com parâmetros de atribuição limpos e painel de acompanhamento de LTV.

A Feature 045 entrega:
- Cadastro e aprovação de parceiros afiliados com links exclusivos (`https://hupflow.com/r/:code`).
- Motor financeiro de comissionamento escalonado por níveis (Tier System: Bronze 20%, Silver 25%, Gold 30%, Diamond 40% recorrente por 12 meses).
- Rastreamento de conversões (Trial, Assinatura Pro, Assinatura Agency, Upgrade) com cálculo de LTV gerado e Churn atribuído.
- Gestão e aprovação de solicitações de saque (Payouts via Pix, Transferência Bancária ou PayPal/Stripe Connect).
- Painel para o gestor em `/settings/affiliates` e modal de convite de novos parceiros.

## 2. Requisitos Funcionais
- **RF01**: Cadastro de parceiros afiliados com geração de código único de referência (`referralCode`).
- **RF02**: Cálculo automático de comissões por plano assinado (MRR líquido).
- **RF03**: Progressão automática de nível (Tier upgrade) com base no volume de clientes ativos ou MRR gerado.
- **RF04**: Solicitação e quitação de saques com controle de saldo disponível vs saldo pendente.
- **RF05**: Tabela de conversões e eventos de referência para auditoria financeira.
- **RF06**: Painel `/settings/affiliates` com cards de KPIs (MRR Gerado por Afiliados, Comissões a Pagar, Parceiros Ativos, Ticket Médio).

## 3. Requisitos Não-Funcionais
- **RNF01**: 100% Clean-Room TypeScript, sem dependências de plugins externos fechados.
- **RNF02**: Isolamento rigoroso de permissões RBAC (`requireOrgRole`).
- **RNF03**: Resiliência com fallback pré-populado em memória para testes offline e modo demo.
