# Requirements: Gestão de Membros, Convites por E-mail & Papéis RBAC

> Identificador: `015-hupflow-team-members-rbac`  
> Data: `2026-10-16`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta feature implementa o subsistema completo de gestão de equipe e controle de acesso baseado em papéis (RBAC) para o HupFlow.
Ela permite aos administradores e proprietários de um workspace listar os colaboradores ativos, enviar convites por e-mail com papéis granulares (`admin`, `member`, `viewer`), cancelar convites pendentes, aceitar convites com vinculação segura à organização, alterar permissões e revogar acessos. No frontend, entrega a página de administração `/settings/members` em Dark Mode e a tela de aceitação de convites `/accept-invite`.

---

## 2. Contexto a partir do legado e specs SDD

| Fonte | Trecho relevante | Confidência |
|-------|------------------|:-----------:|
| `_reversa_sdd/permissions.md` | "Matriz de Permissões e Controle de Acesso (RBAC) do HupFlow: ADMIN (gerencia membros), MEMBER (cria posts e mídia), VIEWER (leitura de calendário e métricas)." | 🟢 |
| `_reversa_sdd/sdd/01-auth-multitenant.md` | "Modelo de dados com tabela members contendo organization_id, user_id e role ('owner' \| 'admin' \| 'member')." | 🟢 |
| `_reversa_sdd/prd.md#escopo-mvp` | "Autenticação & Multi-Tenancy: Organizações com isolamento rígido de dados e gestão de membros da equipe." | 🟢 |
| `_reversa_sdd/addenda/014-hupflow-auth-org-context.md` | "Contexto seguro de autenticação AuthContext fornecendo organizationId e organizationRole validados no backend." | 🟢 |
| `hupflow/src/lib/db/schema.ts` | Tabelas `members` e `invitations` já estruturadas no esquema Drizzle. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Eduardo (Owner / Admin da Agência)** | Convidar redatores, designers e clientes para seus respectivos workspaces com permissões ajustadas. | Acessa `/settings/members`, clica em "Convidar Membro", insere o e-mail do redator e seleciona o papel "Criador (Member)". Copia o link de convite ou dispara o e-mail. |
| **Beatriz (Redatora / Member)** | Produzir carrosséis e agendar postagens sem ter acesso a dados de faturamento ou poder excluir outros usuários. | Entra pelo link de convite, aceita a entrada no workspace e acessa as ferramentas de estúdio e agendamento da agência. |
| **Carlos (Cliente / Viewer)** | Acompanhar o calendário editorial e pré-visualizar postagens agendadas sem permissão de edição. | Recebe convite como "Visualizador (Viewer)", acessa o dashboard e visualiza a grade semanal de publicações em modo somente leitura. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Inviolabilidade do Owner):** Toda organização possui ao menos um `owner`. O `owner` nunca pode ser removido da organização nem ter seu papel alterado para um nível inferior. Transferência de posse só pode ser realizada pelo próprio `owner`. 🟢
2. **RN-02 (Permissão de Gestão de Membros):** Apenas usuários com papel `owner` ou `admin` na organização ativa podem convidar novos membros, revogar convites pendentes, remover membros ou alterar papéis. Usuários com papel `member` ou `viewer` recebem HTTP 403 Forbidden ao tentar tais operações. 🟢
3. **RN-03 (Papéis Suportados):** O sistema suporta 4 níveis de papéis:
   - `owner`: Controle irrestrito do workspace e transferência de posse.
   - `admin`: Gerenciamento de membros, convites, configurações e conexões sociais.
   - `member`: Criação, edição, geração por IA, upload de mídia e agendamento de posts.
   - `viewer`: Visualização de calendário editorial, postagens e métricas analíticas. 🟢
4. **RN-04 (Ciclo de Vida e Expiração de Convite):** Convites são emitidos com expiração de 7 dias e status inicial `pending`. Convites com status diferente de `pending` ou com data de expiração vencida não podem ser aceitos. Ao ser aceito, o status transita para `accepted` e um registro correspondente é inserido na tabela `members`. 🟢
5. **RN-05 (Isolamento Multi-Tenant em Convites):** É expressamente proibido enviar, listar ou aceitar convites de outra organização sem validação criptográfica do token ou resolução segura do tenant no servidor. Tentativas de aceitar convite com token divergente resultam em HTTP 400/404. 🟢

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|:----------:|--------------------|:-----------:|
| **RF-01** | Helper de autorização RBAC (`hupflow/src/lib/auth/rbac.ts`). | Must | Funções `hasMinRole(userRole, requiredRole)` e `requireOrgRole(req, minRole)` que validam privilégios e bloqueiam acessos indevidos com 403. | 🟢 |
| **RF-02** | Endpoints de Gestão de Membros (`/api/org/members`). | Must | `GET` retorna lista de membros (com nome, e-mail, avatar e role); `PATCH` altera o role de um membro; `DELETE` remove um membro (rejeitando remoção do próprio usuário ou do owner). | 🟢 |
| **RF-03** | Endpoints de Convites (`/api/org/invitations`). | Must | `GET` lista convites pendentes da organização; `POST` cria convite com e-mail, role e token seguro; `DELETE` revoga convite pendente. | 🟢 |
| **RF-04** | Endpoint de Aceite de Convite (`/api/auth/invitations/accept`). | Must | Rota pública/autenticada que valida token de convite, cria a membresia na organização e marca o convite como aceito. | 🟢 |
| **RF-05** | Página de Administração de Membros (`/settings/members`). | Must | Interface completa em Dark Mode com listagem de membros, badge de papéis, modal de convite interativo e aba/seção de convites pendentes. | 🟢 |
| **RF-06** | Tela de Aceite de Convite (`/accept-invite?token=...`). | Should | Página para o convidado confirmar entrada no workspace com feedback visual imediato e redirecionamento ao dashboard. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|:-----------:|
| **Segurança** | Prevenção de Privilege Escalation e validação estrita de autoridade do requisitante no backend. | RBAC centralizado em `rbac.ts` com tipagem estrita TypeScript. | 🟢 |
| **Desempenho** | Consultas otimizadas com joins no Drizzle ORM entre `members`, `users` e `invitations`. | Latência de listagem de equipe inferior a 30ms. | 🟢 |
| **Usabilidade** | Interface refinada com cópia de link de convite em 1 clique, confirmações de remoção e micro-interações. | Design System Dark Premium do HupFlow com Tailwind CSS. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Membro sem privilégio tenta convidar usuário
  Dado que o usuário "Beatriz" possui papel "member" na organização
  Quando ela dispara POST /api/org/invitations com email "novo@empresa.com"
  Então o servidor retorna status HTTP 403 Forbidden com mensagem de privilégio insuficiente

Cenário: Admin convida novo colaborador
  Dado que o usuário "Eduardo" é "admin" na organização
  Quando ele dispara POST /api/org/invitations com email "designer@empresa.com" e role "member"
  Então o servidor cria o convite pendente e retorna HTTP 201 com os dados do convite e token gerado

Cenário: Tentativa de remoção do Owner da organização
  Dado que o usuário "Eduardo" é o "owner" da organização
  Quando qualquer membro dispara DELETE /api/org/members/[eduardo_id]
  Então o servidor rejeita a operação com status HTTP 400 Bad Request impedindo a exclusão
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|:------:|---------------|
| **RF-01 (Helper RBAC)** | Must | Núcleo de segurança para validar autorizações em rotas de membros e configurações. |
| **RF-02 & RF-03 (APIs de Membros & Convites)** | Must | Operações essenciais para funcionamento do fluxo de colaboração da equipe. |
| **RF-04 (Aceite de Convite)** | Must | Necessário para concluir a entrada do novo membro na organização. |
| **RF-05 (Página /settings/members)** | Must | Ponto focal de interface para os gestores da agência gerenciarem seus times. |
| **RF-06 (Tela /accept-invite)** | Should | Experiência de onboarding fluida para o colaborador convidado. |

---

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. O modelo de dados de membros e convites já está validado e consistente com o Drizzle schema.

---

## 10. Lacunas

*(Nenhuma dúvida impeditiva — 100% dos requisitos confirmados com base na matriz RBAC e Drizzle schema)*

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Versão inicial gerada por `/reversa-requirements` | reversa-requirements |
