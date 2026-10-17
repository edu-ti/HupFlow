# Roadmap: Central de Notificações In-App & Alertas do Workspace

> Identificador: `026-hupflow-notification-center`  
> Data de Criação: `2026-10-16`  
> Status: `plan`  

---

## 1. Visão Geral das Fases

```
Fase 1 (Preparação) ➔ Fase 2 (Testes) ➔ Fase 3 (Núcleo) ➔ Fase 4 (Componentes UI & Integração) ➔ Fase 5 (Validação & Governança)
```

---

## 2. Detalhamento por Fase

### Fase 1: Preparação & Tipagem
- **T001**: Definir interfaces TypeScript para `NotificationItem`, `NotificationType`, `CreateNotificationInput` e `NotificationListResponse` em `hupflow/src/lib/notifications/types.ts`.
- **T002**: Adicionar tabela `notifications` no Drizzle ORM em `hupflow/src/lib/db/schema.ts` com índices e FKs para users e organizations.

### Fase 2: Testes
- **T003**: Criar testes unitários em `hupflow/src/lib/notifications/notifications.test.ts` cobrindo formatação de mensagens, ícones por severidade e cálculo de contadores de não lidas.

### Fase 3: Núcleo de Serviço & Rota REST
- **T004**: Implementar serviço em `hupflow/src/lib/notifications/service.ts`:
  - `createNotification`: Inserção resiliente.
  - `listUserNotifications`: Listagem filtrada e contagem atômica de não lidas.
  - `markNotificationAsRead`: Atualização pontual.
  - `markAllNotificationsAsRead`: Atualização em lote.
- **T005**: Criar rota REST `/api/notifications/route.ts` (GET e PATCH).

### Fase 4: Componentes de Interface
- **T006**: Criar componente `NotificationBell.tsx` em `hupflow/src/components/notifications/NotificationBell.tsx` com popover suspenso, badges e ações de leitura rápida.
- **T007**: Integrar `NotificationBell` no cabeçalho do layout do dashboard em `hupflow/src/app/(dashboard)/layout.tsx`.
- **T008**: Criar página dedicada `/notifications/page.tsx` para histórico completo e filtros.

### Fase 5: Polimento & Governança
- **T009**: Bateria de testes com `tsx`, validação estática `tsc --noEmit` com zero erros, adendo SDD 026 e sincronização Reversa.
