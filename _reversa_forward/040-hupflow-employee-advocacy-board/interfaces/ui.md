# UI Interfaces: 040-hupflow-employee-advocacy-board

## Componentes & Páginas
1. **`hupflow/src/components/advocacy/AdvocacyCampaignCard.tsx`**
   - Card interativo de campanha do mural de Employee Advocacy contendo:
     - Título, departamento, canal (`linkedin`, `instagram`, `x`) e recompensa em pontos (`+75 pts`).
     - Abas seletoras das **3 Personas em 1ª Pessoa** (`Visão Executiva`, `Bastidores Técnicos`, `Consultivo / Vendas`) para que cada membro copie uma versão única anti-penalização algorítmica.
     - Métricas de impacto da campanha: **Alcance Orgânico**, **Cliques Estimados** e **Economia de Mídia Paga (R$)**.
     - Botões de ação: **Copiar Copy + Registrar Compartilhamento (+Pontos)** e **Remover**.

2. **`hupflow/src/app/(dashboard)/settings/advocacy/page.tsx`**
   - Header executivo e filtro por canal social.
   - 4 KPI Cards no topo:
     1. **Economia Equivalente em Ads (R$)**
     2. **Alcance Orgânico Acumulado da Equipe**
     3. **Compartilhamentos Realizados**
     4. **Embaixadores Ativos no Leaderboard**
   - Coluna principal com as campanhas ativas (`AdvocacyCampaignCard`) + Coluna lateral com o **Leaderboard Gamificado de Embaixadores** (medalhas Diamond, Gold, Rising Star) e formulário de publicação de Nova Campanha no Mural.
