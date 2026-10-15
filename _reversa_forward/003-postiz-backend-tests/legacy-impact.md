# Impacto no Legado: Suíte Inicial de Testes Unitários no Postiz Backend (Auth e Multi-tenant)

> Feature: `003-postiz-backend-tests`  
> Data de Execução: `2026-10-14`  
> Política de Edição Ativa: `allowLegacyEdits: true`  
> Escopo Liberado em `allowedPaths`: `["carousel-generator-main/**", "postiz-app-main/**"]`  

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `postiz-app-main/apps/backend/src/services/auth/auth.middleware.spec.ts` | `postiz-backend-api` | `componente-novo` | LOW | Arquivo de teste unitário Jest cobrindo o `AuthMiddleware` |
| `postiz-app-main/libraries/nestjs-libraries/src/user/org.from.request.spec.ts` | `postiz-integrations-libraries` | `componente-novo` | LOW | Arquivo de teste unitário Jest cobrindo `@GetOrgFromRequest` e `@GetUserFromRequest` |

## 2. Diff Conceitual por Componente

### Componente: `postiz-backend-api`
- **Antes**: O backend possuía 0 testes automatizados, deixando a regra mais crítica de segurança do sistema (RN-01 Isolamento Multi-tenant e autenticação) sem verificação em esteiras de integração contínua (`GAP-CRIT-01`).
- **Depois**: O sistema ganha uma suíte de 11 testes unitários isolados em memória com mocks de `AuthService`, `UsersService` e `OrganizationService`, garantindo validação imediata de rejeição (403), resolução de tenant, `showorg` e impersonação de SuperAdmin.

## 3. Regras Preservadas

Todas as regras existentes do sistema permanecem intactas:
- **RN-01 (Isolamento Multi-tenant Postiz)**: Totalmente preservada e agora auditada via testes unitários.
- **RN-02 (Limites de Texto e Mídia)**: Preservada.
- **RN-03 (Renovação de Tokens OAuth)**: Preservada.
- **RN-04 (Idempotência via Temporal)**: Preservada.

## 4. Regras Modificadas

Nenhuma regra pré-existente foi alterada ou removida. Os testes apenas comprovam a fidelidade do comportamento existente.
