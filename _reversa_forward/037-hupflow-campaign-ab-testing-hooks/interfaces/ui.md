# UI Interfaces: 037-hupflow-campaign-ab-testing-hooks

## Componentes & Páginas
1. **`hupflow/src/components/ab-testing/AbExperimentCard.tsx`**
   - Card comparativo lado a lado (**Variante A — Controle** vs. **Variante B — Desafiante**) com:
     - Badges de canal, tipo de experimento (`hook_copy`, `carousel_cover`, `cta_button`) e status (`Em Execução` ou `Vencedor Declarado`).
     - Caixas comparativas para A e B exibindo o copy/headline, impressões, conversões, taxa de conversão (%) e coroa de destaque na variante líder.
     - Barra de progresso de **Significância Estatística (%)** com Z-Score, Lift Relativo (`+X%`) e status de tamanho mínimo de amostra.
     - Botões de ação rápida: **Simular +250 Impressões**, **Promover Vencedora** e **Excluir**.

2. **`hupflow/src/app/(dashboard)/settings/ab-testing/page.tsx`**
   - Header executivo e filtros por status (`all`, `running`, `completed`).
   - 4 KPI Cards no topo:
     1. **Experimentos Ativos / Total**
     2. **Lift Médio de Conversão (%)**
     3. **Confiança Estatística Média (%)**
     4. **Auto-Winners Promovidos**
   - Grid de experimentos com `AbExperimentCard` + formulário interativo de criação de Novo Teste A/B (com geração automática opcional da Variante B por ângulo psicológico).
