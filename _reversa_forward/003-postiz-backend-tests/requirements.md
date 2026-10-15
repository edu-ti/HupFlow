# Requirements: Suíte Inicial de Testes Unitários no Postiz Backend (Auth e Multi-tenant)

> Identificador: `003-postiz-backend-tests`  
> Data: `2026-10-14`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

## 1. Resumo executivo

Esta feature estabelece a primeira suíte de testes unitários automatizados do backend do Postiz, atacando diretamente a principal dívida técnica do sistema (`GAP-CRIT-01` e Pergunta 2 de validação). O foco é blindar a fronteira mais crítica de segurança: o `AuthMiddleware` e os decorators `@GetOrgFromRequest` / `@GetUserFromRequest`, garantindo proteção estrita contra vazamento de dados entre organizações multi-tenant, bloqueio de requisições não autenticadas e integridade do fluxo de impersonação de administradores.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#4-dívidas-técnicas-identificadas` | Item 1: Ausência Completa de Testes Automatizados (0 testes implementados no legado). | 🟢 |
| `_reversa_sdd/domain.md#rn-01-isolamento-rigoroso-multi-tenant` | RN-01: Nenhuma operação pode ocorrer sem isolamento de `OrganizationId`. | 🟢 |
| `_reversa_sdd/code-analysis.md#24-módulo-postiz-backend-api` | `auth.middleware.ts` intercepta requisições, valida JWT e injeta `req.org` e `req.user`. | 🟢 |
| `_reversa_sdd/confidence-report.md#3-lacunas-pendentes-principais` | Lacuna 2: Cobertura de Testes Automatizados no Postiz. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Engenheiro de Backend / QA | Garantir que alterações no código não quebrem o isolamento multi-tenant ou o fluxo de autenticação. | Executar `pnpm run test` e obter validação imediata em milissegundos sobre as regras de rejeição de token e isolamento de tenant. |

## 4. Regras de negócio novas ou alteradas

1. **RN-TEST-01: Verificação Rigorosa de Rejeição de Não-Autenticados** 🟢
   - Origem no legado: `postiz-app-main/apps/backend/src/services/auth/auth.middleware.ts:35-38`
   - Tipo: preservada / coberta
   - Descrição: Requisições sem token de autenticação em header ou cookie devem obrigatoriamente disparar `HttpForbiddenException` (HTTP 403).

2. **RN-TEST-02: Isolamento Estrito de Tenant via Header `showorg`** 🟢
   - Origem no legado: `postiz-app-main/apps/backend/src/services/auth/auth.middleware.ts:96-104`
   - Tipo: preservada / coberta
   - Descrição: Um usuário só pode acessar uma organização se for membro ativo dela. Tentativas de forçar `showorg` de outra organização devem ser ignoradas ou rejeitadas, mantendo o usuário em sua própria organização.

3. **RN-TEST-03: Bloqueio de Usuários Desativados ou sem Organização Ativa** 🟢
   - Origem no legado: `postiz-app-main/apps/backend/src/services/auth/auth.middleware.ts:56-58` e `108-110`
   - Tipo: preservada / coberta
   - Descrição: Usuários com `activated: false` ou com organizações marcadas como `disabled: true` são impedidos de transacionar.

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Criar arquivo de teste `auth.middleware.spec.ts` cobrindo cenários negativos de token e ativação | Must | Testes unitários Jest com mocks de `AuthService`, `UsersService` e `OrganizationService` | 🟢 |
| RF-02 | Cobrir cenários de resolução multi-tenant e seleção de organização (`showorg`) | Must | Validar atribuição correta de `req.org` e isolamento entre tenants | 🟢 |
| RF-03 | Cobrir fluxo de impersonação exclusivo para `isSuperAdmin` | Should | Validar que usuário comum não consegue impersonar e superadmin acessa tenant alvo | 🟢 |
| RF-04 | Criar testes unitários para os decorators `@GetOrgFromRequest` e `@GetUserFromRequest` | Should | Validar extração dos objetos a partir do `ExecutionContext` | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Execução rápida de testes unitários | Mocks isolados em memória sem depender de banco de dados real PostgreSQL rodando | 🟢 |
| Manutenibilidade | Uso de padrões Jest e `@nestjs/testing` | Compatibilidade nativa com o ecossistema NestJS existente | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Tentativa de acesso sem credencial
  Dado uma requisição HTTP sem cabeçalho auth e sem cookie auth
  Quando o AuthMiddleware processar a requisição
  Então deve lançar HttpForbiddenException
  E a função next() não deve ser chamada

Cenário: Usuário autenticado pertence à organização A e tenta acessar organização B via showorg
  Dado um usuário com token JWT válido pertencente apenas à organização A
  Quando a requisição enviar o cabeçalho showorg apontando para a organização B
  Então o AuthMiddleware deve selecionar a organização A (sua legítima)
  E req.org.id deve ser igual à organização A
  E a função next() deve ser chamada com sucesso
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Segurança fundamental da aplicação |
| RF-02 | Must | Garantia da regra mais crítica do sistema (RN-01 Multi-tenant) |
| RF-03 | Should | Auditoria da funcionalidade administrativa |
| RF-04 | Should | Completude da cobertura dos utilitários de injeção |

## 9. Esclarecimentos

> Modo autônomo ativado: dúvidas convertidas em premissas explícitas documentadas.

## 10. Lacunas

- 🟡 [DÚVIDA] Os testes devem utilizar Jest tradicional ou Vitest?
  - *Premissa assumida*: Jest, pois `postiz-app-main/package.json` define `"test": "jest ..."` e `jest.config.ts` já está presente na raiz.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-requirements` no modo autônomo | reversa |
