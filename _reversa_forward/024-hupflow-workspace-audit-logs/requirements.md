# Requisitos da Feature: Trilha de Auditoria do Workspace (Workspace Audit Logs)

> Identificador: `024-hupflow-workspace-audit-logs`  
> Data de Criação: `2026-10-16`  
> Autor: Equipe Reversa Forward  
> Status: `requirements`  

---

## 1. Visão Geral & Objetivos de Negócio

Empresas, agências e equipes corporativas que utilizam o HupFlow necessitam de rastreabilidade completa e compliance sobre ações realizadas na plataforma. A **Trilha de Auditoria do Workspace** registra de forma imutável quem realizou cada ação, quando ocorreu, de qual endereço IP e quais entidades foram afetadas (posts, canais sociais, convites, permissões, chaves de API, webhooks e faturamento).

### Principais Objetivos
1. **Conformidade & Governança (SOC 2, LGPD e ISO 27001)**: Registro persistente e não-repudiável de eventos críticos de segurança e gerenciamento editorial.
2. **Diagnóstico & Resolução de Conflitos**: Identificar quem editou ou deletou um post agendado, quem aprovou uma publicação com erro ou quem revogou um canal conectado.
3. **Visibilidade Administrativa**: Painel em `/settings/audit` com filtros rápidos por categoria (Segurança, Conteúdo, Equipe, Integrações), ator e intervalo de datas.
4. **Exportação de Dados**: Capacidade de exportar a trilha de eventos filtrada em formato CSV para auditorias externas.

---

## 2. Escopo & Casos de Uso

### UC-01: Registro Automático de Eventos
- O sistema intercepta ações do servidor e registra em segundo plano sem impactar a latência da requisição do usuário.
- Cada log contém: `id`, `organizationId`, `actorId`, `actorName`, `actorEmail`, `action`, `category`, `entityType`, `entityId`, `details` (JSON com contexto específico), `ipAddress`, `createdAt`.

### UC-02: Categorias e Tipos de Ação Auditáveis
- **Segurança & Acesso (`security`)**: `auth.login`, `api_key.created`, `api_key.revoked`.
- **Conteúdo & Publicação (`content`)**: `post.created`, `post.updated`, `post.deleted`, `post.submitted`, `post.approved`, `post.rejected`, `post.published`, `post.failed`.
- **Equipe & Acessos (`team`)**: `member.invited`, `member.removed`, `member.role_updated`.
- **Canais & Conectores (`connectors`)**: `channel.connected`, `channel.disconnected`.
- **Automações & Webhooks (`integrations`)**: `webhook.created`, `webhook.updated`, `webhook.deleted`.

### UC-03: Consulta e Filtros no Painel
- Acesso restrito a usuários com perfil `admin` ou `owner` (`requireOrgRole(req, 'admin')`).
- Filtros por:
  - Categoria (`all`, `security`, `content`, `team`, `connectors`, `integrations`).
  - Ação específica.
  - Ator (por e-mail ou nome).
  - Intervalo de datas (`hoje`, `7d`, `30d`, `tudo`).
- Visualização detalhada de metadados em modal ou card expansível.

### UC-04: Exportação para CSV
- Geração instantânea de arquivo CSV a partir dos logs filtrados na tela, permitindo auditorias externas e relatórios formais.

---

## 3. Critérios de Aceite (DoD - Definition of Done)

1. [x] Zero dependências AGPL e zero bibliotecas proprietárias/comerciais fechadas.
2. [x] Tabela `workspace_audit_logs` no schema Drizzle com índices em `(organization_id, created_at)` e `(organization_id, category)`.
3. [x] Função `recordAuditLog` resiliente (falha silenciosa para não quebrar a transação de negócio principal do usuário).
4. [x] Rota REST `/api/audit-logs` com RBAC `admin` suportando paginação e múltiplos filtros.
5. [x] Painel `/settings/audit/page.tsx` com UI moderna em Dark Mode, tabela responsiva, badges por categoria e botão de exportação CSV.
6. [x] Atalho na barra lateral do dashboard.
7. [x] Testes unitários com `tsx` cobrindo formatação de logs, filtros e serialização CSV com 100% de aprovação.
8. [x] Verificação estática com `npx tsc --noEmit` com zero erros.
9. [x] Adendo formal `_reversa_sdd/addenda/024-hupflow-workspace-audit-logs.md` e arquivos de governança.
