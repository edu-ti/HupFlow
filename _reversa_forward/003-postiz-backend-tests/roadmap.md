# Roadmap: Suíte Inicial de Testes Unitários no Postiz Backend (Auth e Multi-tenant)

> Identificador: `003-postiz-backend-tests`  
> Data: `2026-10-14`  
> Requirements: `_reversa_forward/003-postiz-backend-tests/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

## 1. Resumo da abordagem

Esta evolução técnica cria a primeira suíte de testes unitários automatizados do Postiz Backend, suprindo a carência identificada na extração reversa (`GAP-CRIT-01`). A abordagem foca na camada de segurança e isolamento multi-tenant: o `AuthMiddleware` (`apps/backend/src/services/auth/auth.middleware.ts`) e os decorators associados (`GetOrgFromRequest`, `GetUserFromRequest`). Criaremos `auth.middleware.spec.ts` utilizando mocks isolados de dependências (`AuthService`, `UsersService`, `OrganizationService`) para validar todos os casos de autorização, bloqueio e resolução de tenant sem depender de instâncias externas de banco PostgreSQL ou Redis.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Segurança em Profundidade | Garante que requisições inválidas ou tentativas de cruzar tenants sejam bloqueadas na porta de entrada da API. | respeita |
| Testabilidade e Isolamento | Testes unitários puros executados em memória com tempo de execução inferior a 2 segundos. | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Criar `auth.middleware.spec.ts` diretamente ao lado do middleware sob teste | Padrão idiomático do ecossistema NestJS / Jest que facilita descoberta e manutenção | Criar pasta separada `test/unit` fora da árvore de código | 🟢 |
| D-02 | Utilizar mocks de serviços em vez de instanciar `@prisma/client` | Elimina necessidade de banco PostgreSQL rodando para executar testes rápidos na esteira de CI/CD | Testes e2e com docker compose (mais lentos e pesados) | 🟢 |
| D-03 | Cobrir exaustivamente 8 cenários de autenticação, multi-tenant e impersonação | Cobre 100% dos ramos de execução do middleware crítico | Cobrir apenas o caminho feliz | 🟢 |

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| O runtime de execução suporta módulos ES e decorators TypeScript via Jest | Configurações existentes em `jest.config.ts` | Ajuste pontual em flags de compilação SWC/TS-Jest |

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `AuthMiddlewareSpec` | `postiz-app-main/apps/backend/src/services/auth/auth.middleware.spec.ts` | componente-novo | Suíte de testes unitários para o middleware de autenticação e multi-tenant. |
| `OrgFromRequestSpec` | `postiz-app-main/libraries/nestjs-libraries/src/user/org.from.request.spec.ts` | componente-novo | Teste unitário para validação do decorator de injeção de organização. |

## 6. Delta no modelo de dados

- Resumo das mudanças: Nenhuma modificação no schema Prisma ou no banco de dados.
- Detalhe completo em: `_reversa_forward/003-postiz-backend-tests/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| `auth-middleware-spec` | Suíte de Testes Unitários | `_reversa_forward/003-postiz-backend-tests/interfaces/auth-middleware-tests.md` |

## 8. Plano de migração

Nenhuma migração necessária; os arquivos de teste são adicionados sem quebrar código de produção existente.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Incompatibilidade de import path `@gitroom/*` nos testes | Baixo | Média | Utilizar mock direto e mapeamento de paths compatível com o `tsconfig.json` do backend |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Arquivo `auth.middleware.spec.ts` criado cobrindo todos os cenários críticos
- [ ] Arquivo `org.from.request.spec.ts` criado cobrindo a extração de tenant
- [ ] Adendo gerado em `_reversa_sdd/addenda/003-postiz-backend-tests.md`

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-plan` no modo autônomo | reversa |
