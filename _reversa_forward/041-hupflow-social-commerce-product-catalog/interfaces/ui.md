# UI Interfaces: 041-hupflow-social-commerce-product-catalog

## Componentes & Páginas
1. **`hupflow/src/components/commerce/SocialProductCard.tsx`**
   - Card analítico de produto/oferta do Catálogo Social Commerce contendo:
     - Nome do produto, código `SKU`, badge de categoria (`Plano SaaS`, `Infoproduto`, `Produto Físico`, `Consultoria`), rede social e tier de velocidade (`Best-Seller`, `Alta Margem`, `Estável`, `Otimizar`).
     - Grid de atribuição financeira: **Preço Unitário**, **Receita Atribuída (R$)**, **RPM Social (R$/1k views)**, **EPC (R$/clique)** e **Conversão de Checkout (%)**.
     - Box de **Legenda Shoppable IA** com botão de cópia em 1 clique.
     - Botões de ação: **Simular +3 Vendas Sociais** e **Remover**.

2. **`hupflow/src/app/(dashboard)/settings/commerce/page.tsx`**
   - Header executivo e filtros por categoria de produto.
   - 4 KPI Cards no topo:
     1. **Receita Social Direta (R$)**
     2. **RPM Social Médio (R$ / 1k Impressões)**
     3. **Taxa Média de Conversão de Checkout (%)**
     4. **Total de Pedidos Orgânicos Atribuídos**
   - Lista de produtos com `SocialProductCard` + formulário lateral para cadastrar nova oferta/produto comprável.
