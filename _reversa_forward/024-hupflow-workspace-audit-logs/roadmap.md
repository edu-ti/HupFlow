# Roadmap: Trilha de Auditoria do Workspace (Workspace Audit Logs)

> Identificador: `024-hupflow-workspace-audit-logs`  
> Data de Criação: `2026-10-16`  
> Status: `plan`  

---

## 1. Visão Geral das Fases

O roadmap divide a entrega em 5 fases sequenciais:

```
Fase 1 (Preparação) ➔ Fase 2 (Testes) ➔ Fase 3 (Núcleo) ➔ Fase 4 (Interface & Exportação) ➔ Fase 5 (Validação & Governança)
```

---

## 2. Detalhamento por Fase

### Fase 1: Preparação & Tipagem
- **T001**: Definir interfaces TypeScript para `AuditLogEntry`, `AuditCategory`, `AuditAction`, `CreateAuditLogInput`, `AuditLogFilter` e `AuditLogExportRow` em `hupflow/src/lib/audit/types.ts`.
- **T002**: Adicionar tabela `workspace_audit_logs` no Drizzle ORM em `hupflow/src/lib/db/schema.ts` com índices por data e categoria.

### Fase 2: Testes
- **T003**: Criar testes unitários em `hupflow/src/lib/audit/audit.test.ts` cobrindo formatação de ações, sanitização de metadados e conversão para CSV com escape RFC 4180.

### Fase 3: Núcleo de Serviço & Rota REST
- **T004**: Implementar serviço em `hupflow/src/lib/audit/service.ts`:
  - `recordAuditLog`: Inserção não-bloqueante resiliente.
  - `listAuditLogs`: Consulta com múltiplos filtros e ordenação decrescente.
  - `exportAuditLogsToCsv`: Serialização em texto CSV formatado.
- **T005**: Criar rota REST `/api/audit-logs` (GET e POST) com verificação de perfil `admin`.

### Fase 4: Interface & Exportação
- **T006**: Criar painel visual em `hupflow/src/app/(dashboard)/settings/audit/page.tsx` com filtros de categoria, busca textual, tabela interativa e modal de detalhes JSON.
- **T007**: Implementar download de CSV em 1 clique no painel com tratamento de caracteres UTF-8.
- **T008**: Adicionar atalho "Auditoria & Logs" no menu lateral do dashboard em `hupflow/src/app/(dashboard)/layout.tsx`.

### Fase 5: Polimento & Governança
- **T009**: Execução dos testes unitários, validação estática de tipagem (`tsc --noEmit`), testes de regressão, geração do adendo SDD 024 e sincronização dos estados do Reversa.
