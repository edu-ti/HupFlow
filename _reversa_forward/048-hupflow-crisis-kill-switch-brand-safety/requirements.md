# Requisitos — Feature 048: Kill Switch de Segurança & Gestão de Crise (Brand Safety Emergency Pause)

## 1. Visão Geral
Em situações de crise de imagem pública, acidentes corporativos, tragédias nacionais ou boicotes repentinos, agências e equipes de marketing precisam suspender instantaneamente todas as publicações agendadas em todos os canais conectados (Instagram, Threads, LinkedIn, X, TikTok, YouTube Shorts) em **1 clique**.

A **Feature 048** implementa o **Kill Switch de Segurança & Gestão de Crise (Brand Safety)**:
1. **Pausa Global Atômica da Fila**: Um único comando com confirmação segura altera o status da organização para `CRISIS_MODE_PAUSED`, bloqueando imediatamente qualquer dispatcher ou scheduler de disparar posts.
2. **Congelamento por Canal ou por Marca Específica**: Permite pausar apenas uma marca da carteira de agência ou apenas uma rede social específica (ex: pausar apenas o X durante um ataque de bots).
3. **Registro de Auditoria de Incidentes**: Log do motivo da ativação (ex: "Tragédia climática regional", "Falha de produto em recall"), responsável (usuário + cargo), data/hora exata e contagem de posts congelados.
4. **Descongelamento Seguro com Preview**: Procedimento de retomada que permite revisar a fila antes de despausar, evitando disparo em lote descontrolado de posts atrasados.

## 2. Requisitos Funcionais
- **RF01**: Estado de Organização `brandSafetyState` com status `normal`, `warning`, `emergency_paused`.
- **RF02**: Bloqueio de agendamento em nível de middleware e scheduler: quando ativo, nenhuma rotina de postagem em background despacha posts com data/hora vencida.
- **RF03**: Registro detalhado na tabela `crisis_incident_logs` com incidentes arquivados para compliance e governança.
- **RF04**: Botão visual de emergência com trava de confirmação (necessário digitar "CONFIRMAR PAUSA" ou PIN) no dashboard e na página dedicada `/settings/kill-switch`.
- **RF05**: Notificação visual proeminente tipo banner global em todo o dashboard alertando a equipe sobre o modo de crise ativo.

## 3. Critérios de Aceite Clean-Room
- Zero dependências de telemetria externa proprietária.
- 100% de cobertura com testes unitários em TypeScript puro (`npx tsx`).
- Conformidade total com `tsc --noEmit` (zero erros).
- Isolamento estrito por `organizationId` com RBAC exigindo no mínimo `admin` para ativar ou desativar o Kill Switch.
