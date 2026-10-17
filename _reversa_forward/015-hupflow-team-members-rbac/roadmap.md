# Roadmap: Gestão de Membros, Convites por E-mail & Papéis RBAC

> Identificador: `015-hupflow-team-members-rbac`  
> Data: `2026-10-16`  
> Requirements: `_reversa_forward/015-hupflow-team-members-rbac/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem técnica implementa a gestão de equipe e autorização baseada em papéis (RBAC) estruturada em 4 camadas:
1. **Camada de Autorização & RBAC (`hupflow/src/lib/auth/rbac.ts`):** Helpers utilitários de servidor para verificação de permissões hierárquicas (`owner: 4 > admin: 3 > member: 2 > viewer: 1`), validação de ação mínima requerida e proteção contra escalonamento de privilégios.
2. **Rotas de API REST de Membros & Convites:**
   - `/api/org/members`: `GET` para listagem com dados de usuário (nome, e-mail, avatar, papel), `PATCH` para atualização de papel e `DELETE` para desvinculação da organização (bloqueando auto-exclusão e exclusão do owner).
   - `/api/org/invitations`: `GET` para listagem de convites ativos/pendentes, `POST` para emissão de novos convites com expiração de 7 dias e token aleatório seguro, `DELETE` para cancelamento/revogação.
   - `/api/auth/invitations/accept`: Endpoint para validação do token e inclusão do usuário logado na organização com o papel especificado.
3. **Página de Administração de Membros (`hupflow/src/app/(dashboard)/settings/members/page.tsx`):**
   - Cabeçalho com métricas (Total de Membros, Convites Pendentes, Papéis).
   - Tabela de Membros Ativos com badge visual de papel, data de entrada e menu de ações contextuais.
   - Tabela de Convites Pendentes com botão de cópia rápida do link de aceite e botão de revogação.
   - Modal interativo "Convidar Novo Membro" com validação de formato de e-mail e seletor de papéis com descrição didática das permissões.
4. **Página de Aceite de Convite (`hupflow/src/app/(auth)/accept-invite/page.tsx`):**
   - Resolução visual do convite a partir do token da query string (`?token=...`).
   - Botão de aceite em um clique para usuários já autenticados, com redirecionamento ao dashboard do novo workspace.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|:------:|
| **Zero Contaminação AGPL / Clean-Room** | Implementação nativa TypeScript com Drizzle ORM e Next.js 15, sem dependências proprietárias ou de licença viral. | Respeita 🟢 |
| **Princípio do Menor Privilégio (PoLP)** | Operações de alteração de papel, envio de convite e desvinculação exigem expressamente autoridade de `admin` ou `owner`. | Respeita 🟢 |
| **Inviolabilidade do Owner** | Nenhum membro (mesmo admin) pode rebaixar, alterar ou excluir o `owner` da organização. | Respeita 🟢 |
| **Design System Dark Premium** | Interfaces ricas com paleta HSL balanceada, micro-animações, estados de loading e feedback toast. | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|:-----------:|
| **D-01** | Hierarquia de papéis com pontuação numérica (`owner: 4, admin: 3, member: 2, viewer: 1`) | Permite comparações intuitivas e de alta performance (`roleWeight[userRole] >= roleWeight[requiredRole]`) sem necessidade de parsing complexo. | Checagem de array de permissões string (mais pesado e propenso a inconsistências). | 🟢 |
| **D-02** | Token criptográfico aleatório (`crypto.randomUUID()` / `nanoid`) para convites | Garante que links de convite não sejam adivinháveis e elimina necessidade de e-mail transacional obrigatório em dev (copiar link funciona offline). | Token JWT assinado com chave secreta (mais difícil de revogar pontualmente no banco). | 🟢 |
| **D-03** | Rota `/settings/members` dentro do grupo `(dashboard)` | Mantém a consistência visual, barra lateral e seletor de workspaces intactos enquanto o usuário gerencia sua equipe. | Criar rota raiz `/members` isolada. | 🟢 |
| **D-04** | Validação transacional de integridade na exclusão e aceite | Impede condições de corrida em convites simultâneos e garante que uma organização nunca fique órfã sem owner. | Validações assíncronas soltas sem lock. | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| O esquema Drizzle já possui as tabelas `members` e `invitations` mapeadas | `requirements.md#2` | Baixo; validado diretamente no código em `schema.ts`. |
| Usuários convidados que já possuem conta podem aceitar o convite imediatamente | `requirements.md#RN-04` | Baixo; lógica suportada via sessão Better-Auth existente. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|------------|---------------------------|:---------------:|--------|
| `rbac.ts` | `_reversa_sdd/permissions.md` | Componente Novo | Helpers canônicos de autorização e controle de acesso RBAC. |
| `rbac.test.ts` | `_reversa_sdd/permissions.md` | Componente Novo | Suíte automatizada de testes cobrindo hierarquia e bloqueios. |
| `/api/org/members/route.ts` | `_reversa_sdd/sdd/01-auth-multitenant.md` | Componente Novo | API para listagem, alteração de papel e remoção de membros. |
| `/api/org/invitations/route.ts` | `_reversa_sdd/sdd/01-auth-multitenant.md` | Componente Novo | API para emissão, listagem e cancelamento de convites. |
| `/api/auth/invitations/accept/route.ts` | `_reversa_sdd/sdd/01-auth-multitenant.md` | Componente Novo | API para validação e efetivação do aceite de convite. |
| `/settings/members/page.tsx` | `_reversa_sdd/prd.md` | Componente Novo | Painel de controle de equipe e convites no dashboard. |
| `/accept-invite/page.tsx` | `_reversa_sdd/prd.md` | Componente Novo | Tela de boas-vindas e confirmação de entrada no workspace. |
| `layout.tsx` | `_reversa_sdd/prd.md` | Modificado | Adição do link "Equipe & Membros" na barra lateral de navegação. |

---

## 6. Delta no modelo de dados

As tabelas `members` e `invitations` já existem em `schema.ts`. Atualizaremos os tipos em `types.ts` para contemplar `viewer` nos papéis aceitos (`owner | admin | member | viewer`).
Detalhe completo em: `_reversa_forward/015-hupflow-team-members-rbac/data-delta.md`.

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| Gestão de Membros & Convites | HTTP REST | `_reversa_forward/015-hupflow-team-members-rbac/interfaces/members-invitations-api.md` |

---

## 8. Plano de migração / rollout

1. Não requer migrations de banco (tabelas já sincronizadas).
2. O helper `requireOrgRole` pode ser aplicado gradualmente em rotas existentes onde a diferenciação de papéis se tornar relevante.

---

## 9. Riscos e contingências

| Risco | Impacto | Probabilidade | Mitigação |
|-------|:-------:|:-------------:|-----------|
| Tentativa de remoção do último owner | Alto | Baixa | Validação estrita no endpoint `DELETE`: rejeita se o alvo for `owner`. |
| Convite expirado sendo aceito | Médio | Média | Endpoint de aceite verifica `expiresAt > new Date()` e status `pending`. |
| Membro comum tentando mudar seu próprio papel para admin | Alto | Média | Endpoint `PATCH` exige que o requisitante seja `admin` ou `owner` e impede auto-promoção. |

---

## 10. Critério de pronto

- [ ] Helpers `hasMinRole` e `requireOrgRole` implementados e cobertos por testes unitários com 100% de sucesso.
- [ ] Endpoints de membros e convites operacionais e protegidos contra BOLA e bypass.
- [ ] Interface `/settings/members` funcional com modal de convite e cópia de link.
- [ ] Tela `/accept-invite` operacional para novos colaboradores.
- [ ] Link "Equipe & Membros" integrado na barra lateral do dashboard.
- [ ] Compilação estática `tsc --noEmit` finalizada com 0 erros.
