# Interfaces de Usuário (UI) — Feature 049: Relatórios Executivos em PDF

## 1. Página `/settings/reports`
- **Seletor de Marca / Cliente**: Alterna a visão entre as marcas da agência.
- **Botão de Geração Instantânea**: "⚡ Gerar Relatório Agora", abrindo modal com escolha do período (últimos 7 dias, últimos 30 dias, mês anterior).
- **Cards de Métricas de Entrega**:
  - Relatórios Emitidos no Mês.
  - Taxa de Abertura / Visualizações de Clientes.
  - Horas de Relatório Poupadas pela IA.
- **Tabela / Grid de Relatórios Gerados**:
  - Título do Relatório.
  - Marca / Cliente.
  - Período Analisado.
  - Resumo de KPIs (Impressões, Engajamento, Top Post).
  - Botão de Download PDF direto.
  - Botão de Copiar Link Compartilhável.

## 2. Componentes Clean-Room
- `ClientReportCard.tsx`: Exibição visual com badge de status, período e download.
- `GenerateReportModal.tsx`: Modal interativo com configuração de período e e-mails.
