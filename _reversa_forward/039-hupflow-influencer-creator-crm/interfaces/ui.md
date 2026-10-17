# UI Interfaces: 039-hupflow-influencer-creator-crm

## Componentes & Páginas
1. **`hupflow/src/components/creators/CreatorPartnershipCard.tsx`**
   - Card analítico de parceria com influenciador/criador contendo:
     - Nome, `@handle`, rede social, estágio do pipeline (`Prospecção`, `Negociação`, `Contratado`, `Em Revisão`, `Publicado`) e badge de tier de ROI (`ROI Elite`, `Lucrativo`, `Break-Even`, `Abaixo da Meta`).
     - Barra de progresso de entregáveis (`deliverablesCompleted / deliverablesTotal`) e cupom/UTM exclusivo.
     - Grid financeiro: **Cachê Acordado**, **Receita Direta + EMV**, **CPE (R$)** e **ROI Total (%)**.
     - Box de **Briefing UGC IA** com botão de cópia em 1 clique.
     - Botões de ação: **Registrar Entregável (+Views/Vendas)**, **Avançar Estágio** e **Remover**.

2. **`hupflow/src/app/(dashboard)/settings/creators/page.tsx`**
   - Header executivo e filtros por estágio do pipeline CRM.
   - 4 KPI Cards no topo:
     1. **ROI Consolidado da Carteira (%)**
     2. **Valor Gerado (Receita + EMV) vs. Investido**
     3. **CPE Médio (Custo por Engajamento)**
     4. **Taxa de Conclusão de Entregáveis (%)**
   - Lista de parcerias com `CreatorPartnershipCard` + formulário lateral para cadastrar novo criador/influenciador.
