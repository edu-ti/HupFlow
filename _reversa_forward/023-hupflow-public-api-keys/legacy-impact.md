# Análise de Impacto no Sistema: Chaves de API Públicas (Public API Keys)

> Identificador da Feature: `023-hupflow-public-api-keys`  
> Data: `2026-10-16`  
> Responsável: Equipe de Governança Reversa  

---

## 1. Escopo de Impacto

A Feature 023 introduziu um subsistema completo e seguro de Chaves de API públicas (`hup_live_...`) voltado para automações externas, integrações com o n8n/Zapier, SDKs e pipelines corporativos de CI/CD.

O impacto no ecossistema existente foi estritamente **aditivo e não-destrutivo**:
- Nenhuma alteração nas tabelas existentes de posts, canais ou usuários.
- Adição da tabela `api_keys` no schema Drizzle, com restrições de integridade referencial vinculadas a `organizations` e `users`.
- O armazenamento utiliza hash SHA-256 unidirecional (`key_hash`), garantindo que nem administradores do banco de dados tenham acesso aos tokens brutos após a geração.
- Nova rota REST `/api/api-keys` protegida por RBAC (`requireOrgRole(req, 'admin')`).
- Painel de desenvolvedor integrado em `/settings/keys` com snippets prontos em cURL e TypeScript.

---

## 2. Matriz de Componentes Afetados

| Componente | Tipo de Modificação | Risco | Mitigação Aplicada |
|------------|---------------------|:-----:|-------------------|
| `hupflow/src/lib/db/schema.ts` | Adição da tabela `api_keys` | Baixo | Sem breaking changes; apenas criação de nova tabela com Drizzle ORM. |
| `hupflow/src/lib/api-keys/types.ts` | Novo arquivo de tipos e escopos | Mínimo | Interfaces TypeScript estritas com tipos literais para escopos. |
| `hupflow/src/lib/api-keys/service.ts` | Novo serviço de hashing, geração e validação | Mínimo | Criptografia nativa `node:crypto`, validação em tempo constante. |
| `hupflow/src/app/api/api-keys/route.ts` | Nova rota REST (GET, POST, DELETE) | Baixo | Proteção RBAC com `requireOrgRole(req, 'admin')`. |
| `hupflow/src/app/(dashboard)/settings/keys/page.tsx` | Nova página do desenvolvedor | Mínimo | Componente React cliente isolado, com design tokens e microinterações. |
| `hupflow/src/app/(dashboard)/layout.tsx` | Adição de link na sidebar | Mínimo | Adição de item sem alterações de fluxo de renderização ou layout base. |

---

## 3. Segurança & Conformidade (Clean-Room & OWASP)

1. **Armazenamento de Segredos**: O segredo bruto é exibido uma única vez ao usuário e jamais persistido em logs ou colunas de banco. Apenas o hash SHA-256 de 64 caracteres e o prefixo mascarado `hup_live_...` são armazenados.
2. **Prevenção de Timing Attacks**: A comparação é feita por correspondência exata de hash no índice único do banco em `O(1)`.
3. **Escopos Granulares**: Validador `hasScope` garante o princípio do menor privilégio (`least privilege`), permitindo restringir chaves para apenas leitura ou escrita.
4. **Isolamento Multitenant**: Toda consulta e revogação é obrigatoriamente filtrada por `organizationId`.
