# UI Interfaces: 036-hupflow-competitor-benchmark-radar

## Componentes & Páginas
1. **`hupflow/src/components/competitors/CompetitorRadarCard.tsx`**
   - Exibe o card analítico de um perfil concorrente com:
     - Nome, `@handle`, badge da rede social (`instagram`, `linkedin`, `tiktok`, `youtube`, `x`) e nível de pressão competitiva (`critical`, `high`, `moderate`, `low`).
     - Barra de progresso de **Share of Voice (%)** e alcance engajado semanal estimado.
     - Comparativo direto com a linha de base da organização (Seguidores, Engajamento %, Posts/Semana, Crescimento 30d).
     - Chips dos tópicos dominantes (`topTopics`) e formato vencedor (`topFormat`).
     - Botões de ação rápida: **Sincronizar Snapshot** e **Remover**.

2. **`hupflow/src/app/(dashboard)/settings/competitors/page.tsx`**
   - Header executivo com indicador de **Share of Voice da Sua Marca** e filtro por canal social.
   - 4 KPI Cards no topo:
     1. **Share of Voice da Marca (%)** vs. Concorrentes
     2. **Delta de Engajamento** vs. Média do Nicho
     3. **Cadência Semanal** vs. Média do Nicho
     4. **Content Gaps IA Detectados** (Oportunidades inexploradas)
   - Seção **Análise de Lacunas de Conteúdo (Content Gaps IA)** com cards acionáveis contendo `opportunityScore`, formato recomendado e botão **Copiar Gancho IA**.
   - Grid de concorrentes monitorados usando `CompetitorRadarCard` + formulário para adicionar novo concorrente ao radar.
