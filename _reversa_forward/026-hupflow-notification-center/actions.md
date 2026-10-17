# Actions: Central de Notificações In-App & Alertas do Workspace

> Identificador: `026-hupflow-notification-center`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/026-hupflow-notification-center/roadmap.md`  

---

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 9 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 4 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Definir interfaces TypeScript para notificações e contadores em types.ts | - | `[//]` | `hupflow/src/lib/notifications/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabela notifications e índices no schema.ts | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para o despachante e formatador de notificações | T001 | - | `hupflow/src/lib/notifications/notifications.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço de criação, contagem e leitura em service.ts | T001, T002 | - | `hupflow/src/lib/notifications/service.ts` | 🟢 | `[x]` |
| T005 | Criar rota REST /api/notifications (GET, PATCH) | T001, T004 | - | `hupflow/src/app/api/notifications/route.ts` | 🟢 | `[x]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar componente NotificationBell com dropdown popover e contadores | T005 | `[//]` | `hupflow/src/components/notifications/NotificationBell.tsx` | 🟢 | `[x]` |
| T007 | Integrar NotificationBell no cabeçalho do layout em layout.tsx | T006 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |
| T008 | Criar página dedicada de notificações em /notifications/page.tsx | T005 | - | `hupflow/src/app/(dashboard)/notifications/page.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Bateria de testes com tsx, validação estática tsc --noEmit e governança | T003, T005, T006, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |

---

## Notas de execução

- **T001**: Criado `hupflow/src/lib/notifications/types.ts` com tipagem para `NotificationType`, `NotificationSeverity`, `NotificationItem`, `CreateNotificationInput` e `NotificationListResponse`.
- **T002**: Tabela `notifications` adicionada ao Drizzle ORM em `hupflow/src/lib/db/schema.ts` com chave estrangeira para `organizations` e `users`.
- **T003**: Testes unitários implementados em `notifications.test.ts` cobrindo mapeamento de severidades e integridade de tipos com 100% de sucesso.
- **T004**: Serviço de notificações com criação resiliente `createNotification`, listagem `listUserNotifications` e marcações de leitura em lote em `hupflow/src/lib/notifications/service.ts`.
- **T005**: Rota RESTful criada em `hupflow/src/app/api/notifications/route.ts` suportando listagem com contador de não lidas e mutações atômicas via PATCH.
- **T006**: Componente `NotificationBell.tsx` desenvolvido com popover suspenso, badges coloridas por severidade, backdrop dismiss e atalhos de ação.
- **T007**: Integrado `NotificationBell` no cabeçalho superior do dashboard em `hupflow/src/app/(dashboard)/layout.tsx`.
- **T008**: Página expandida `/notifications/page.tsx` criada com tabs de filtro e histórico de alertas.
- **T009**: Compilação TypeScript com `npx tsc --noEmit` aprovada com 0 erros. Adendo SDD 026, legacy-impact e regression-watch registrados.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
| 2026-10-16 | Conclusão integral de T001 a T009 com 100% de aprovação | reversa-coding |
