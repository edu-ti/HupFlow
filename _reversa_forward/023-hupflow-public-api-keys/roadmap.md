# Roadmap: Feature 023 - Chaves de API Públicas

> Identificador: `023-hupflow-public-api-keys`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## Fases de Entrega

1. **Fase 1: Preparação & Modelagem**
   - Definir interfaces TypeScript para tokens, escopos e verificação em `src/lib/api-keys/types.ts`.
   - Adicionar tabela `api_keys` com chave única por hash em `src/lib/db/schema.ts`.

2. **Fase 2: Testes Unitários de Geração & Validação**
   - Criar bateria de testes unitários para hashing SHA-256, geração de token com prefixo canônico e validação de escopos em `src/lib/api-keys/api-keys.test.ts`.

3. **Fase 3: Núcleo do Serviço & Rotas REST**
   - Implementar funções de geração, hashing e validação em `src/lib/api-keys/service.ts`.
   - Criar rotas `/api/api-keys/route.ts` (GET, POST, DELETE) com proteção RBAC e isolamento multi-tenant.

4. **Fase 4: Interfaces de Usuário & Navegação**
   - Criar painel do desenvolvedor em `src/app/(dashboard)/settings/keys/page.tsx` com listagem de chaves ativas, modal de emissão com escopos, aviso de token único e snippets de código cURL/TypeScript.
   - Adicionar atalho "Chaves de API" no menu lateral do dashboard em `src/app/(dashboard)/layout.tsx`.

5. **Fase 5: Polimento & Governança**
   - Executar bateria completa de testes unitários com `npx tsx`.
   - Validação estática sem erros com `npx tsc --noEmit`.
   - Documentação de adendo em `_reversa_sdd/addenda/023-hupflow-public-api-keys.md`, `legacy-impact.md` e `regression-watch.md`.
