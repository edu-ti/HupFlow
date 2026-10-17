# Onboarding: Testando o Dashboard de Analytics do HupFlow

> Identificador: `016-hupflow-analytics-metrics`  
> Data: `2026-10-16`  

---

## 1. Pré-requisitos

1. Servidor de desenvolvimento rodando ou testes unitários locais.
2. Organização ativa selecionada no dashboard.

---

## 2. Passo a Passo para Teste Manual

### Cenário 1: Navegação para o Dashboard de Analytics
1. No menu lateral do dashboard, clique no item **"Métricas & Analytics"** (rota `/analytics`).
2. A tela carrega os 4 KPI Cards no topo:
   - **Impressões Totais**: Total de exibições do conteúdo nas redes.
   - **Alcance Único**: Contas únicas alcançadas.
   - **Interações Totais**: Soma de curtidas, comentários e compartilhamentos.
   - **Taxa Média de Engajamento**: Percentual de engajamento sobre alcance.

### Cenário 2: Filtragem por Período
1. No seletor de período, alterne entre:
   - **7 dias** (grade semanal de alta resolução).
   - **30 dias** (visão mensal consolidada).
   - **90 dias** (evolução trimestral de alcance).
2. Observe que o gráfico vetorial SVG atualiza suavemente seus pontos e gradientes para o intervalo selecionado.

### Cenário 3: Filtragem por Canal Social
1. Selecione um canal específico (ex: **Instagram** ou **LinkedIn**).
2. O dashboard recalcula os KPIs e a tabela de **Top Publicações** para exibir apenas postagens do canal selecionado.
