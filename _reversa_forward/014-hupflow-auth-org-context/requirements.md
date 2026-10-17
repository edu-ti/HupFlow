# Requirements: Autenticação, Sessões Better-Auth & Contexto Multi-Tenant de Organização

> Identificador: `014-hupflow-auth-org-context`  
> Data: `2026-10-16`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta feature implementa a camada canônica de autenticação, resolução de sessão e isolamento multi-tenant do HupFlow.
Ela estabelece um helper unificado no backend (`getAuthContext`) que valida tokens e cookies de sessão via Better-Auth, determina com segurança a organização ativa do usuário através do vínculo de membresia, e blinda todas as rotas de API (`/api/media/*`, `/api/ai/*`), eliminando a vulnerabilidade onde parâmetros de tenant vinham desprotegidos no payload. Adicionalmente, entrega as telas de Login e Cadastro (`/login`, `/register`) e torna interativo o seletor de workspaces no dashboard.

---

## 2. Contexto a partir do legado e specs SDD

| Fonte | Trecho relevante | Confidência |
|-------|------------------|:-----------:|
| `_reversa_sdd/sdd/01-auth-multitenant.md` | "Better-Auth com Drizzle Adapter e plugin de organizações para isolamento multi-tenant rígido por OrganizationId." | 🟢 |
| `_reversa_sdd/prd.md#escopo-mvp` | "Autenticação & Multi-Tenancy: Cadastro de usuários e login com e-mail/senha, organizações com isolamento rígido de dados." | 🟢 |
| `_reversa_sdd/domain.md#regras-de-negocio` | "Nenhum usuário pode visualizar, alterar ou excluir dados pertencentes a outra organização." | 🟢 |
| `hupflow/src/lib/auth/auth.ts` | Configuração central do Better-Auth com plugins de organização e esquemas Drizzle já mapeados. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Eduardo (Admin / Gestor da Agência)** | Alternar entre workspaces de clientes com total garantia de que os carrosséis, mídias e posts de um cliente nunca vazem para outro. | Acessa o dashboard, clica no seletor de workspaces na barra lateral, escolhe "Cliente Alfa" e todas as listas de mídia e calendário são filtradas instantaneamente para essa organização. |
| **Criador / Redator** | Fazer login com e-mail e senha e acessar apenas os recursos autorizados da organização a qual foi adicionado. | Acessa `/login`, insere credenciais, recebe sessão segura e é redirecionado ao dashboard com sua organização primária ativa. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Resolução Autoritativa de Tenant no Backend):** O `organizationId` NUNCA é confiado a partir do corpo da requisição JSON (`req.body`) ou de parâmetros de query livre em rotas protegidas. Ele deve ser obrigatoriamente resolvido no servidor a partir da sessão Better-Auth do usuário logado. 🟢
2. **RN-02 (Isolamento Estrito em Operações de Leitura e Deleção):** Operações como exclusão de mídias (`DELETE /api/media?id=...`) ou listagem de assets devem verificar estritamente `and(eq(media.id, id), eq(media.organizationId, activeOrgId))`. Caso o item pertença a outro tenant, a rota deve retornar HTTP 404/403. 🟢
3. **RN-03 (Fallback Elegante para Desenvolvimento Local):** Em ambiente local / offline (`NODE_ENV === 'development'`) ou quando a flag `DEV_BYPASS_AUTH` estiver habilitada, o helper deve prover um contexto mock seguro (`dev_user`, `org_default`), permitindo desenvolvimento e testes fluidos sem dependência contínua de cookies de produção. 🟢
4. **RN-04 (Persistência do Workspace Ativo):** A organização ativa selecionada pelo usuário é mantida no cookie seguro `hupflow_active_org` e validada contra a tabela `members` para impedir spoofing de workspace. 🟢

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|:----------:|--------------------|:-----------:|
| **RF-01** | Helper canônico `getAuthContext(req)` em `hupflow/src/lib/auth/session.ts`. | Must | Função assíncrona que valida cabeçalhos, extrai sessão e retorna `{ user, session, organizationId, isDevFallback }` ou lança/retorna 401. | 🟢 |
| **RF-02** | Blindagem das rotas de mídia (`/api/media/presign`, `/api/media/confirm`, `/api/media`). | Must | Rotas atualizadas para extrair `organizationId` exclusivamente de `getAuthContext`. DELETE valida pertencimento da mídia ao tenant. | 🟢 |
| **RF-03** | Blindagem das rotas de IA (`/api/ai/carousel`, `/api/ai/copywriter`). | Must | Bloqueia requisições não autenticadas com HTTP 401 Unauthorized. | 🟢 |
| **RF-04** | Telas de Login e Cadastro (`/login`, `/register`). | Must | Interfaces completas em Dark Mode com validação de campos, feedback de erro e redirecionamento para o dashboard após login. | 🟢 |
| **RF-05** | Seletor interativo de Workspace em `layout.tsx`. | Must | Menu dropdown no topo da sidebar que exibe o nome da organização ativa, avatar e permite selecionar outros workspaces. | 🟢 |
| **RF-06** | Cliente Better-Auth para React em `hupflow/src/lib/auth/auth-client.ts`. | Must | Exporta `createAuthClient` configurado para consumo seguro nos componentes de interface. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|:-----------:|
| **Segurança** | Sessões assinadas com proteção contra CSRF e validação de tokens em repouso. | Better-Auth Core com cookies `HttpOnly` e `SameSite=Lax`. | 🟢 |
| **Desempenho** | Resolução de sessão em menos de 25ms através de caching e queries otimizadas no Drizzle. | Postgres connection pool configurada no backend. | 🟢 |
| **Experiência Visual** | Telas de autenticação elegantes, com micro-animações, feedback visual de carregamento e design padronizado. | Tailwind CSS Dark Premium com gradientes e contrastes suaves. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Tentativa de upload em organização não autorizada
  Dado que um usuário autenticado pertence apenas à organização "org_alfa"
  Quando ele dispara POST /api/media/presign tentando forçar "organizationId: org_beta" no body
  Então o servidor ignora o body e gera a URL pré-assinada exclusivamente sob o prefixo "orgs/org_alfa/..."

Cenário: Exclusão de mídia de outro tenant
  Dado que uma mídia "med_123" pertence à "org_beta"
  Quando um usuário autenticado na "org_alfa" dispara DELETE /api/media?id=med_123
  Então o servidor rejeita a operação com status HTTP 404 ou 403 e a mídia permanece intacta no banco
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|:------:|---------------|
| **RF-01 & RF-02 (getAuthContext & blindagem de rotas)** | Must | Elimina vulnerabilidade crítica de segurança e garante isolamento multi-tenant real. |
| **RF-03 (Proteção das rotas de IA)** | Must | Impede abuso de custos de API de LLM por requisições anônimas. |
| **RF-04 (Telas de Login & Cadastro)** | Must | Ponto de entrada canônico para usuários da plataforma SaaS. |
| **RF-05 (Seletor de Workspace)** | Should | Melhora usabilidade para usuários com múltiplas organizações/clientes. |

---

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. O escopo e os padrões do Better-Auth já estão mapeados na especificação SDD 01.

---

## 10. Lacunas

*(Nenhuma dúvida impeditiva — 100% dos requisitos confirmados com base na arquitetura do Better-Auth e Drizzle schema)*

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Versão inicial gerada por `/reversa-requirements` | reversa-requirements |
