# UI Interfaces: 038-hupflow-social-listening-brand-mentions

## Componentes & Páginas
1. **`hupflow/src/components/listening/ListeningMentionCard.tsx`**
   - Exibe o card de um sinal de Social Listening com:
     - Badge de categoria (`Menção à Marca`, `Queixa de Concorrente`, `Tendência do Setor`, `Risco de Crise`), rede social e nível de urgência (`Crise Crítica`, `Alerta Elevado`, `Observação`, `Normal`).
     - Autor, `@handle`, número de seguidores, velocidade (`interações/hora`) e palavra-chave capturada.
     - Box de **Playbook Estratégico IA** com a ação recomendada e botão **Copiar Resposta Estratégica**.
     - Botões de fluxo: **Marcar Engajado**, **Resolver Alerta** e **Excluir**.

2. **`hupflow/src/app/(dashboard)/settings/listening/page.tsx`**
   - Banner superior de alerta caso `crisisAlertActive === true`.
   - 4 KPI Cards no topo:
     1. **Net Sentiment Score (NSS)** (`-100` a `+100`)
     2. **Alertas de Crise / Urgência Alta**
     3. **Oportunidades em Concorrentes (Social Selling)**
     4. **Tópico / Keyword em Alta**
   - Filtros por categoria + listagem de menções com `ListeningMentionCard` + formulário lateral para registrar/simular captura de novo sinal de Social Listening.
