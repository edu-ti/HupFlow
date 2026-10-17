# Requirements: 041-hupflow-social-commerce-product-catalog

## Objetivo
Implementar o **Catálogo Social Commerce, Tags de Produto & Atribuição de Receita Direta por Post/Reel** no HupFlow Clean-Room (`hupflow/**`), permitindo que marcas, infoprodutores, SaaS e e-commerces gerenciem seu catálogo de produtos/planos, vinculem tags compráveis (*Shoppable Tags*) a Reels, Carrosséis e Posts em múltiplas redes (`instagram`, `tiktok`, `youtube`, `linkedin`), calculem métricas financeiras de atribuição orgânica (**Receita Bruta Atribuída**, **RPM Social — Receita por 1.000 Impressões**, **Taxa de Conversão de Checkout %** e **Valor Médio por Clique — EPC**) e gerem automaticamente **Copies Shoppable IA com Gatilho de Checkout**.

## Requisitos Funcionais
- **RF-041-01 (Catálogo Multi-Tenant de Produtos & Infoprodutos)**: Cadastrar, listar, filtrar por categoria (`saas_plan`, `digital_course`, `physical_product`, `consulting_service`), simular conversões e excluir itens do catálogo isolados por `organizationId`.
- **RF-041-02 (Motor de Atribuição de Receita Social — RPM, EPC & Taxa de Checkout)**: Função determinística `evaluateSocialCommerceMetrics` que calcula:
  - **Receita Total Atribuída (`totalRevenueBrl`)**: `ordersCount * priceBrl`
  - **Taxa de Conversão de Checkout (`checkoutConversionPct`)**: `(ordersCount / productClicks) * 100`
  - **EPC — Earnings Per Click (`epcBrl`)**: `totalRevenueBrl / productClicks`
  - **RPM Social — Receita por 1.000 Impressões (`socialRpmBrl`)**: `(totalRevenueBrl / taggedImpressions) * 1000`
  - **Classificação de Conversão (`velocityTier`)**: `'bestseller' | 'high_margin' | 'steady' | 'needs_optimization'`.
- **RF-041-03 (Gerador de Copy Shoppable IA & Pin de Produto)**: Função `generateShoppablePostCopy` que sintetiza a legenda persuasiva com tag de preço, benefício principal e instrução de clique na sacola/link rastreável (`checkoutUrl`).
- **RF-041-04 (Simulação de Vendas Sociais & Sincronização de Estoque/Pedidos)**: Endpoint `POST /api/commerce/action` para simular novos pedidos/cliques vindos de posts marcados (`simulate_order`) ou remover produto (`delete`).
- **RF-041-05 (Painel Visual de Social Commerce & Atribuição)**: Página `/settings/commerce` com 4 KPI Cards (Receita Social Atribuída R$, RPM Social Médio, Taxa de Conversão de Checkout %, Total de Pedidos Orgânicos), cards de produtos (`SocialProductCard.tsx`) com cópia de legenda Shoppable em 1 clique e formulário de adição de novo produto/oferta.

## Requisitos Não-Funcionais
- **RNF-041-01 (Clean-Room & Zero Dependências Externas)**: Motor de atribuição de receita e gerador de copy Shoppable 100% em TypeScript puro (zero dependências AGPL).
- **RNF-041-02 (Isolamento Multi-Tenant & RBAC)**: `requireOrgRole(req, 'viewer')` para leitura do catálogo (`GET /api/commerce`) e `requireOrgRole(req, 'member')` para criação e simulação de pedidos (`POST /api/commerce`, `POST /api/commerce/action`).
- **RNF-041-03 (Resiliência com Fallback em Memória)**: Tabela Drizzle `social_commerce_products` com fallback automático em memória pré-populado com 3 ofertas/produtos de alta conversão.
