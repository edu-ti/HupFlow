# Roadmap: Autenticação, Sessões Better-Auth & Contexto Multi-Tenant de Organização

> Identificador: `014-hupflow-auth-org-context`  
> Data: `2026-10-16`  
> Requirements: `_reversa_forward/014-hupflow-auth-org-context/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem técnica implementa um helper centralizado de segurança (`getAuthContext` / `requireAuthContext`) no diretório `hupflow/src/lib/auth/session.ts`.
Esse helper valida a sessão do Better-Auth através dos cabeçalhos da requisição HTTP (`auth.api.getSession`), resolve a organização ativa do usuário através da tabela `members` e impõe que todas as operações nas rotas de API (`/api/media/*` e `/api/ai/*`) usem obrigatoriamente esse contexto resolvido, bloqueando requisições anônimas ou com tentativas de adulteração de tenant (vulnerabilidade BOLA).
Para viabilizar a experiência completa de ponta a ponta:
- Configura o cliente React do Better-Auth (`auth-client.ts`).
- Entrega telas completas de Login e Registro em Dark Mode (`/login` e `/register`).
- Torna interativo o seletor de workspaces no topo da barra lateral do dashboard.
- Mantém um modo gracioso de fallback para desenvolvimento local e offline.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|:------:|
| **Zero Contaminação AGPL / Licenças Permissivas** | Better-Auth e Drizzle ORM são ambos distribuídos sob licença MIT, mantendo o HupFlow 100% limpo de copyleft. | Respeita 🟢 |
| **Isolamento Multi-Tenant Estrito** | Toda requisição autenticada é amarrada ao `organizationId` da sessão; queries de leitura e deleção filtram estritamente por tenant. | Respeita 🟢 |
| **Defesa em Profundidade (OWASP BOLA Protection)** | O servidor nunca confia em parâmetros de identificação de tenant enviados no body do cliente. | Respeita 🟢 |
| **Experiência Visual Premium** | Telas de autenticação e dropdown de workspaces com estética moderna, tipografia refinada e micro-interações. | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|:-----------:|
| **D-01** | Helper unificado `getAuthContext(req)` em vez de middlewares complexos | Server Actions e Route Handlers no Next.js 15 possuem contextos de execução distintos; uma função utilitária tipada permite checagem granular com baixo acoplamento e tratamento uniforme de erros. | Middleware global do Next.js (mais rígido e difícil de customizar para rotas com bypass dev). | 🟢 |
| **D-02** | Validação no banco com `and(eq(media.id, id), eq(media.organizationId, orgId))` | Impede que a rota DELETE apague registros pertencentes a outras organizações mesmo que o usuário conheça o UUID do arquivo. | Buscar primeiro e checar na memória (duas queries em vez de uma). | 🟢 |
| **D-03** | Fallback dev controlado quando sem sessão em `NODE_ENV === 'development'` | Garante que testes unitários, pipelines de CI e prototipação rápida offline continuem funcionando sem exigir banco populado ou cookies ativos. | Bloquear tudo com 401 sempre (quebraria testes locais). | 🟢 |
| **D-04** | Cookie seguro `hupflow_active_org` para alternância de workspace | Permite sincronização instantânea entre abas e requisições do mesmo usuário sem precisar atualizar o registro de usuário no banco a cada clique. | Salvar `activeOrganizationId` no banco a cada clique. | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| O Better-Auth já está montado no catch-all `/api/auth/[...all]` | RF-01 | Baixo; a rota já existe e está importada via `toNextJsHandler(auth)`. |
| Organização ativa padrão é a primeira organização em que o usuário foi cadastrado | RN-04 | Baixo; comportamento padrão esperado em plataformas multi-tenant. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|------------|---------------------------|:---------------:|--------|
| `authClient` | `_reversa_sdd/sdd/01-auth-multitenant.md` | Componente Novo | Cliente React do Better-Auth para login, logout e troca de workspace. |
| `getAuthContext` | `_reversa_sdd/sdd/01-auth-multitenant.md` | Componente Novo | Helper de resolução de sessão segura e extração autoritativa de tenant. |
| `/api/media/*` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Modificado | Blindagem de todas as rotas de mídia com validação de sessão e isolamento de tenant. |
| `/api/ai/*` | `_reversa_sdd/sdd/03-carousel-engine.md` | Modificado | Proteção de autenticação nas rotas de geração de carrossel e copywriting. |
| `/login` & `/register` | `_reversa_sdd/prd.md` | Componente Novo | Telas de autenticação completas e responsivas. |
| `WorkspaceSelector` | `_reversa_sdd/prd.md` | Componente Novo | Dropdown de seleção de workspaces na barra lateral do dashboard. |

---

## 6. Delta no modelo de dados

Nenhuma alteração estrutural necessária. As tabelas `users`, `sessions`, `organizations` e `members` já contemplam todas as necessidades em `hupflow/src/lib/db/schema.ts`.
Detalhe completo em: `_reversa_forward/014-hupflow-auth-org-context/data-delta.md`.

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| Autenticação & Contexto de Organização | HTTP / Cookies | `_reversa_forward/014-hupflow-auth-org-context/interfaces/auth-api.md` |

---

## 8. Plano de migração

Não aplicável (sem migrations no schema).

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|:-------:|:-------------:|-----------|
| Bloqueio acidental de testes unitários que não passam headers de sessão | Alto | Médio | Suporte a fallback gracioso de desenvolvimento em `getAuthContext` quando `NODE_ENV === 'development'`. |
| Descompasso entre cookie de workspace ativo e permissões reais do usuário | Alto | Baixo | `getAuthContext` valida obrigatoriamente se o usuário pertence à organização solicitada na tabela `members`. |

---

## 10. Critério de pronto

- [ ] Helper `getAuthContext` e `requireAuthContext` implementados e testados unitariamente.
- [ ] Rotas `/api/media/presign`, `/api/media/confirm` e `/api/media` (GET/DELETE) blindadas contra BOLA.
- [ ] Rotas `/api/ai/carousel` e `/api/ai/copywriter` protegidas contra requisições anônimas.
- [ ] Telas `/login` e `/register` criadas e estilizadas com feedback de validação.
- [ ] Seletor de workspace no layout do dashboard interativo e funcional.
- [ ] Testes unitários com `tsx` passando com 100% de sucesso.
- [ ] `tsc --noEmit` executado sem nenhum erro de tipagem.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Versão inicial gerada por `/reversa-plan` | reversa-plan |
