# Actions: Gestão de Chaves de API Públicas (Public API Keys)

> Identificador: `023-hupflow-public-api-keys`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/023-hupflow-public-api-keys/roadmap.md`  

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
| T001 | Definir interfaces TypeScript para tokens, escopos e verificação em types.ts | - | `[//]` | `hupflow/src/lib/api-keys/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabela api_keys com hash SHA-256 e índices em schema.ts | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para geração de token, hash SHA-256 e validação de escopos | T001 | - | `hupflow/src/lib/api-keys/api-keys.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço de geração, hashing e validação em service.ts | T001, T002 | - | `hupflow/src/lib/api-keys/service.ts` | 🟢 | `[x]` |
| T005 | Criar rota REST /api/api-keys (GET, POST, DELETE) com proteção RBAC | T001, T004 | - | `hupflow/src/app/api/api-keys/route.ts` | 🟢 | `[x]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar painel visual de desenvolvedores em /settings/keys/page.tsx | T005 | `[//]` | `hupflow/src/app/(dashboard)/settings/keys/page.tsx` | 🟢 | `[x]` |
| T007 | Adicionar snippets de código prontos (cURL, TypeScript) no painel de chaves | T006 | - | `hupflow/src/app/(dashboard)/settings/keys/page.tsx` | 🟢 | `[x]` |
| T008 | Adicionar atalho "Chaves de API" no menu lateral do dashboard em layout.tsx | T006 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Bateria completa de testes com tsx, validação estática tsc --noEmit e governança | T003, T005, T006, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |

---

## Notas de execução

- **T001**: Criado `hupflow/src/lib/api-keys/types.ts` com tipagem para `ApiKeyScope`, `AVAILABLE_SCOPES`, `ApiKey`, `CreateApiKeyInput`, `CreatedApiKeyResponse` e `ValidateApiKeyResult`.
- **T002**: Tabela `api_keys` adicionada ao Drizzle ORM em `hupflow/src/lib/db/schema.ts` com `key_hash` exclusivo e FKs para organizações e usuários.
- **T003**: Testes unitários implementados em `api-keys.test.ts` validando geração de token, hash SHA-256, extração de headers (`Authorization` e `X-API-Key`) e hierarquia de escopos com 100% de sucesso.
- **T004**: Serviço de geração, hashing determinístico e validação implementado em `hupflow/src/lib/api-keys/service.ts`.
- **T005**: Rota RESTful criada em `hupflow/src/app/api/api-keys/route.ts` com proteção RBAC `admin`.
- **T006 & T007**: Painel em `/settings/keys/page.tsx` com lista de chaves, modal de emissão com alerta de segredo exibido apenas uma vez e snippets interativos cURL / TypeScript.
- **T008**: Adicionado item de navegação "Chaves de API" na sidebar de `hupflow/src/app/(dashboard)/layout.tsx`.
- **T009**: `npx tsc --noEmit` aprovado com 0 erros. Regressão executada com 100% de sucesso em todas as suítes (`api-keys`, `approvals`, `webhooks`, `brand-kits`). Adendo SDD 023, legacy-impact e regression-watch gerados.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
| 2026-10-16 | Conclusão integral de T001 a T009 com 100% de aprovação | reversa-coding |
