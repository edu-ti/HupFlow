# Interfaces de Usuário (UI) — Feature 048: Kill Switch & Brand Safety

## 1. Painel Dedicado `/settings/kill-switch`
- **Banner de Status de Alerta**: Vermelho pulsante quando o Kill Switch estiver ativo com horário da pausa e responsável. Verde quando a operação estiver nominal.
- **Botão de Ação Emergencial de Alto Destaque**:
  - Estado Normal: Botão Vermelho "🚨 ATIVAR KILL SWITCH DE EMERGÊNCIA" que abre modal com digitação de frase de confirmação ("CONFIRMAR PAUSA") para prevenir cliques acidentais.
  - Estado Pausado: Botão Âmbar/Verde "Retomar Operações & Despausar Fila" com seletor de tratamento de posts vencidos.
- **Painel de Filtragem por Escopo**: Pausa global, por marca específica ou por rede social.
- **Histórico & Auditoria de Incidentes**: Tabela com data, motivo, responsável e quantidade de publicações salvas do disparo.

## 2. Banner Global no Dashboard
- Quando `isEmergencyPaused === true`, um aviso de perigo fixo é exibido no topo da página alertando que o agendador está pausado preventivamente.
