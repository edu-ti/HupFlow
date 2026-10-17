# Legacy Impact: Autenticação, Sessões Better-Auth & Contexto Multi-Tenant de Organização

> Identificador: `014-hupflow-auth-org-context`  
> Data: `2026-10-16`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/01-auth-multitenant.md`, `_reversa_sdd/sdd/04-composer-copywriter.md`, `hupflow/src/lib/db/schema.ts`)  
> Nota: Feature greenfield em ambiente clean-room, sem legado pré-existente.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/auth/types.ts` | `sdd/01-auth-multitenant` | `componente-novo` | LOW | Definições canônicas de tipos TypeScript para AuthUser, AuthSession, AuthContext e WorkspaceSummary. |
| `hupflow/src/lib/auth/auth-client.ts` | `sdd/01-auth-multitenant` | `componente-novo` | MEDIUM | Cliente React do Better-Auth com plugin de organizações integrado para consumo em componentes frontend. |
| `hupflow/src/lib/auth/session.ts` | `sdd/01-auth-multitenant` | `componente-novo` | CRITICAL | Helpers autoritativos de servidor (`getAuthContext`, `requireAuthContext`, `getUserWorkspaces`) para extração e validação de sessão e membresia. |
| `hupflow/src/lib/auth/session.test.ts` | `sdd/01-auth-multitenant` | `componente-novo` | LOW | Suíte de testes unitários automatizados cobrindo resolução de tenant, fallbacks de desenvolvimento e bloqueio em produção. |
| `hupflow/src/lib/db/schema.ts` | `sdd/01-auth-multitenant` | `modificado` | HIGH | Complementação do esquema Drizzle com tabelas Better-Auth (`accounts`, `verifications`, `invitations`) e colunas de auditoria e tenant ativo. |
| `hupflow/src/lib/auth/auth.ts` | `sdd/01-auth-multitenant` | `modificado` | MEDIUM | Mapeamento explícito de schema Better-Auth e configuração de baseURL do servidor. |
| `hupflow/src/app/api/media/presign/route.ts` | `sdd/04-composer-copywriter` | `modificado` | HIGH | Blindagem contra BOLA: extração autoritativa de tenant da sessão do usuário autenticado. |
| `hupflow/src/app/api/media/confirm/route.ts` | `sdd/04-composer-copywriter` | `modificado` | HIGH | Blindagem: validação de prefixo de chave e registro estrito sob a organização ativa da sessão. |
| `hupflow/src/app/api/media/route.ts` | `sdd/04-composer-copywriter` | `modificado` | HIGH | Blindagem em GET (filtro estrito por tenant) e DELETE (validação de pertencimento antes da exclusão). |
| `hupflow/src/app/api/ai/carousel/route.ts` | `sdd/04-composer-copywriter` | `modificado` | MEDIUM | Bloqueio de requisições anônimas em geração de carrosséis via `requireAuthContext`. |
| `hupflow/src/app/api/ai/copywriter/route.ts` | `sdd/04-composer-copywriter` | `modificado` | MEDIUM | Bloqueio de requisições anônimas em geração de copywriting via `requireAuthContext`. |
| `hupflow/src/app/(auth)/login/page.tsx` | `sdd/01-auth-multitenant` | `componente-novo` | HIGH | Página de autenticação e login em Dark Mode com Better-Auth. |
| `hupflow/src/app/(auth)/register/page.tsx` | `sdd/01-auth-multitenant` | `componente-novo` | HIGH | Página de cadastro de novos usuários com criação de workspace inicial em Dark Mode. |
| `hupflow/src/components/auth/WorkspaceSelector.tsx` | `sdd/01-auth-multitenant` | `componente-novo` | MEDIUM | Dropdown interativo de seleção de workspaces com indicação de papel e modal de novo workspace. |
| `hupflow/src/app/api/auth/workspaces/route.ts` | `sdd/01-auth-multitenant` | `componente-novo` | MEDIUM | Endpoint REST para listagem segura de organizações vinculadas ao usuário autenticado. |
| `hupflow/src/app/(dashboard)/layout.tsx` | `sdd/01-auth-multitenant` | `modificado` | LOW | Substituição de botão estático pelo seletor de workspaces interativo na barra lateral. |

---

## 2. Diff Conceitual por Componente

- **`sdd/01-auth-multitenant`**:
  - Camada central de autenticação e autorização agora totalmente operacional com Better-Auth.
  - Resolução segura de organização ativa no servidor sem confiar em parâmetros arbitrários enviados pelo cliente.
  - Suporte completo a multi-organizações com troca rápida no frontend via cookie seguro e validação em banco.
- **`sdd/04-composer-copywriter`**:
  - Eliminação de vulnerabilidades BOLA (Broken Object Level Authorization) nas rotas de upload e gerenciamento de arquivos.
  - Rotas de IA protegidas contra consumo de créditos e chamadas abusivas anônimas.

---

## 3. Preservadas

*(Feature greenfield em clean-room, nenhum código legado modificado)*

---

## 4. Modificadas

- Esquema Drizzle (`schema.ts`) estendido para tabelas nativas de contas e convites do Better-Auth.
- Rotas de API de mídia e IA atualizadas para exigir sessão válida e tenant resolvido no servidor.
- Layout do Dashboard integrado ao seletor de workspaces.
