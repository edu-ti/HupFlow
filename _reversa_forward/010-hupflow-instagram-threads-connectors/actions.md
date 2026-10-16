# Actions: Conectores Oficiais da Meta (Instagram & Threads)

> Identificador: `010-hupflow-instagram-threads-connectors`  
> Data: `2026-10-15`  
> Roadmap: `_reversa_forward/010-hupflow-instagram-threads-connectors/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 7 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 3 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Documentar variáveis de ambiente da Meta no .env.example do HupFlow | - | `[//]` | `hupflow/.env.example` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T002 | Criar testes unitários automatizados para o fluxo de publicação e validação de limites de Instagram e Threads | - | `[//]` | `hupflow/src/lib/connectors/meta.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Implementar classe InstagramConnector com OAuth 2.0 PKCE, container de mídia e publicação na Graph API | T001 | - | `hupflow/src/lib/connectors/instagram.ts` | 🟢 | `[X]` |
| T004 | Implementar classe ThreadsConnector com OAuth 2.0, publicação de texto (máx 500 chars) e tratamento de erros | T001 | `[//]` | `hupflow/src/lib/connectors/threads.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T005 | Registrar instagramConnector e threadsConnector no index.ts central de conectores | T003, T004 | - | `hupflow/src/lib/connectors/index.ts` | 🟢 | `[X]` |
| T006 | Atualizar worker do BullMQ para mapear providers de Instagram e Threads com tratamento de rate limit | T005 | - | `hupflow/src/lib/queue/worker.ts` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T007 | Refinar ações de conectar e status visual dos provedores na página de Contas Conectadas | T005 | `[//]` | `hupflow/src/app/(dashboard)/accounts/page.tsx` | 🟢 | `[X]` |

---

## Notas de execução

- Todas as 7 tarefas atômicas foram executadas com sucesso.
- Conectores `instagram` e `threads` implementam a interface `SocialConnector` oficial.
- Suporte a tokens de 60 dias da Meta e fluxo de publicação por containers.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Execução e conclusão de todas as 7 ações (T001-T007) da Feature 010 | reversa-coding |
