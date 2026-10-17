# Legacy Impact: Gestão de Membros, Convites por E-mail & Papéis RBAC

> Identificador: `015-hupflow-team-members-rbac`  
> Data: `2026-10-16`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/permissions.md`, `_reversa_sdd/sdd/01-auth-multitenant.md`)  
> Nota: Feature greenfield em ambiente clean-room, sem legado pré-existente.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/auth/types.ts` | `sdd/01-auth-multitenant` | `modificado` | LOW | Tipos estendidos com papel `viewer`, `OrganizationMemberSummary` e `InvitationSummary`. |
| `hupflow/src/lib/auth/rbac.ts` | `sdd/01-auth-multitenant` | `componente-novo` | HIGH | Implementação de RBAC hierárquico (`hasMinRole`, `requireOrgRole`, `canManageMember`). |
| `hupflow/src/lib/auth/rbac.test.ts` | `sdd/01-auth-multitenant` | `componente-novo` | LOW | Suíte de testes unitários para proteção de owner e hierarquia de papéis. |
| `hupflow/src/app/api/org/members/route.ts` | `sdd/01-auth-multitenant` | `componente-novo` | HIGH | Rota GET para listagem dos membros ativos da organização. |
| `hupflow/src/app/api/org/members/[id]/route.ts` | `sdd/01-auth-multitenant` | `componente-novo` | HIGH | Rotas PATCH e DELETE para alteração de papéis e remoção de membros. |
| `hupflow/src/app/api/org/invitations/route.ts` | `sdd/01-auth-multitenant` | `componente-novo` | HIGH | Rotas GET e POST para listagem e criação de convites seguros com expiração de 7 dias. |
| `hupflow/src/app/api/org/invitations/[id]/route.ts` | `sdd/01-auth-multitenant` | `componente-novo` | MEDIUM | Rota DELETE para revogação de convites pendentes. |
| `hupflow/src/app/api/auth/invitations/accept/route.ts` | `sdd/01-auth-multitenant` | `componente-novo` | HIGH | Rotas GET e POST para validação e efetivação de aceite de convite. |
| `hupflow/src/app/(dashboard)/settings/members/page.tsx` | `sdd/01-auth-multitenant` | `componente-novo` | HIGH | Painel administrativo de equipe, papéis e convites com modal e cópia de link. |
| `hupflow/src/app/(auth)/accept-invite/page.tsx` | `sdd/01-auth-multitenant` | `componente-novo` | MEDIUM | Tela pública/autenticada de confirmação de entrada no workspace. |
| `hupflow/src/app/(dashboard)/layout.tsx` | `sdd/01-auth-multitenant` | `modificado` | LOW | Inclusão do link de navegação "Equipe & Membros" na barra lateral. |

---

## 2. Diff Conceitual por Componente

- **`sdd/01-auth-multitenant` & `permissions.md`**:
  - Matriz RBAC totalmente operacional com 4 papéis (`owner`, `admin`, `member`, `viewer`).
  - Proteção contra remoção acidental ou maliciosa do proprietário da organização.
  - Fluxo assíncrono de convites por link seguro e vinculação automática à tabela `members`.

---

## 3. Preservadas

*(Feature greenfield em clean-room, nenhum código legado modificado)*

---

## 4. Modificadas

- Barra lateral de navegação no dashboard atualizada com acesso à gestão de equipe.
- Tipagens de autenticação enriquecidas para suportar resumos de membros e convites.
