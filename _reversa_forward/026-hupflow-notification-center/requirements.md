# Requisitos da Feature: Central de Notificações In-App & Alertas do Workspace

> Identificador: `026-hupflow-notification-center`  
> Data de Criação: `2026-10-16`  
> Autor: Equipe Reversa Forward  
> Status: `requirements`  

---

## 1. Visão Geral & Objetivos de Negócio

No ecossistema colaborativo do HupFlow, múltiplos membros de uma organização atuam simultaneamente: designers criam carrosséis, redatores submetem posts para aprovação, administradores revisam publicações e conectores disparam despachos em segundo plano.

A **Central de Notificações In-App** mantém os usuários informados em tempo real sobre eventos críticos sem depender exclusivamente de e-mails, reduzindo gargalos operacionais e acelerando o ciclo editorial.

### Principais Objetivos:
1. **Visibilidade Imediata**: Notificações instantâneas no cabeçalho do dashboard com contador de não lidas e dropdown interativo.
2. **Alertas Acionáveis (Actionable Notifications)**: Cada notificação inclui link direto para a tela de ação relevante (ex: Central de Revisão para posts submetidos, DLQ para publicações com falha).
3. **Triagem Rápida**: Opção de marcar notificações como lidas individualmente ou "Marcar todas como lidas" em 1 clique.
4. **Página de Histórico Expandido**: Visualização de notificações passadas com paginação e filtros em `/notifications`.

---

## 2. Tipos de Eventos Notificáveis

| Tipo de Evento | Destinatários | Severidade | Ação ao Clicar |
|----------------|---------------|:----------:|----------------|
| `approval_requested` | Administradores e Proprietários | Info / Atenção | Redireciona para `/approvals` |
| `approval_reviewed` | Autor do post | Sucesso / Alerta | Redireciona para `/composer` ou `/approvals` |
| `post_published` | Membros do workspace | Sucesso | Redireciona para `/dashboard` ou `/analytics` |
| `post_failed` | Administradores e Autor | Erro / Crítico | Redireciona para `/queue/failures` (DLQ) |
| `quota_warning` | Proprietário e Administradores | Atenção | Redireciona para `/settings/billing` |
| `member_joined` | Administradores e Proprietários | Info | Redireciona para `/settings/members` |

---

## 3. Casos de Uso

### UC-01: Sino de Notificações no Header
- Ícone de sino com badge numérica vermelha/laranja indicando quantidade de notificações não lidas.
- Ao clicar, abre popover suspenso com as 15 notificações mais recentes.
- Indicador visual entre lidas e não lidas (ponto colorido e fundo destacado).

### UC-02: Marcar como Lida
- Clicar em uma notificação marca automaticamente `isRead = true` e navega até a URL de destino.
- Botão "Marcar todas como lidas" atualiza todo o lote do usuário na organização em 1 clique.

### UC-03: Central Dedicada em `/notifications`
- Visualização completa com paginação, filtros por tipo e histórico de até 90 dias.

---

## 4. Critérios de Aceite (DoD)

1. [x] Zero dependências proprietárias e conformidade Clean-Room.
2. [x] Tabela `notifications` no schema Drizzle ORM com índices por usuário, organização e status de leitura.
3. [x] Função de serviço resiliente `createNotification` (gravação que não bloqueia o fluxo principal).
4. [x] Rota REST `/api/notifications` (GET com lista e contagem, PATCH para leitura individual/em lote).
5. [x] Componente `NotificationBell.tsx` integrado no Top Navbar do dashboard com microinterações.
6. [x] Página dedicada `/notifications/page.tsx` para gestão completa.
7. [x] Testes unitários com `tsx` e compilação estática `tsc --noEmit` com zero erros.
8. [x] Adendo formal `_reversa_sdd/addenda/026-hupflow-notification-center.md` e sincronização Reversa.
