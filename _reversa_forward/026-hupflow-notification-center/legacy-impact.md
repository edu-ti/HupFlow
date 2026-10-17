# Análise de Impacto no Sistema: Central de Notificações In-App

> Identificador da Feature: `026-hupflow-notification-center`  
> Data: `2026-10-16`  
> Responsável: Equipe de Governança Reversa  

---

## 1. Escopo de Impacto

A Feature 026 introduziu a **Central de Notificações In-App & Alertas do Workspace**:
- Notificações instantâneas para aprovações editoriais (`approval_requested`, `approval_reviewed`).
- Notificações de ciclo de vida de publicações (`post_published`, `post_failed` com redirecionamento à DLQ).
- Alertas de capacidade de cotas (`quota_warning`) e entrada de novos membros (`member_joined`).
- Componente `NotificationBell` com popover dinâmico, contador de não lidas e marcação rápida.
- Página dedicada `/notifications` com filtros e histórico completo.

O impacto é **100% aditivo e seguro**:
- Adição da tabela `notifications` no Drizzle ORM sem quebrar entidades existentes.
- Inserções não-bloqueantes (`createNotification`) que não interferem nas transações de negócio principais.
- Rota REST `/api/notifications` protegida pelo middleware RBAC.
- Atualização limpa no Top Navbar do layout do dashboard.

---

## 2. Matriz de Componentes Afetados

| Componente | Tipo de Modificação | Risco | Mitigação Aplicada |
|------------|---------------------|:-----:|-------------------|
| `hupflow/src/lib/db/schema.ts` | Adição da tabela `notifications` | Baixo | Sem breaking changes; apenas criação de nova tabela no Drizzle ORM. |
| `hupflow/src/lib/notifications/types.ts` | Novo arquivo de tipos e categorias | Mínimo | Interfaces TypeScript estritas com tipos literais. |
| `hupflow/src/lib/notifications/service.ts` | Serviço de notificações e contagens | Mínimo | Consultas filtradas por `(userId, organizationId)`. |
| `hupflow/src/app/api/notifications/route.ts` | Nova rota REST (GET, PATCH) | Baixo | Proteção RBAC com `requireOrgRole(req, 'viewer')`. |
| `hupflow/src/components/notifications/NotificationBell.tsx` | Novo componente no Navbar | Mínimo | Popover cliente com backdrop dismiss e polling leve a cada 30s. |
| `hupflow/src/app/(dashboard)/layout.tsx` | Inclusão do sino no header | Mínimo | Adição visual entre selo e avatar sem alterar o grid base. |
| `hupflow/src/app/(dashboard)/notifications/page.tsx` | Nova página do histórico | Mínimo | Interface cliente isolada. |
