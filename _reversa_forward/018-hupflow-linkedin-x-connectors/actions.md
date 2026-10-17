# Actions: Conectores Oficiais LinkedIn Marketing API & X (Twitter) API v2

> Identificador: `018-hupflow-linkedin-x-connectors`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/018-hupflow-linkedin-x-connectors/roadmap.md`  

---

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 9 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 4 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Extender types.ts com suporte a documentTitle, isThread, threadNodes e SocialAccountItem | - | `[//]` | `hupflow/src/lib/connectors/types.ts` | 🟢 | `[X]` |
| T002 | Implementar gerador e validador PKCE (RFC 7636) em pkce.ts | - | `[//]` | `hupflow/src/lib/connectors/pkce.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para PKCE, particionamento de threads e payloads de carrossel PDF | T001, T002 | - | `hupflow/src/lib/connectors/connectors.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Atualizar linkedin.ts com suporte a UGC Posts e Documentos PDF nativos de Carrossel | T001 | - | `hupflow/src/lib/connectors/linkedin.ts` | 🟢 | `[X]` |
| T005 | Atualizar x-twitter.ts com OAuth 2.0 PKCE real e publicação encadeada de Threads | T001, T002 | `[//]` | `hupflow/src/lib/connectors/x-twitter.ts` | 🟢 | `[X]` |
| T006 | Criar rotas /api/connectors/accounts (GET, POST com validação de cota e DELETE) | T001, T004, T005 | - | `hupflow/src/app/api/connectors/accounts/route.ts` | 🟢 | `[X]` |
| T007 | Criar endpoint /api/connectors/publish para teste e despacho multicanal | T004, T005 | `[//]` | `hupflow/src/app/api/connectors/publish/route.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T008 | Integrar tela /accounts com a API real, badges de cota e modal de conexão | T006 | - | `hupflow/src/app/(dashboard)/accounts/page.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Executar bateria de testes com tsx e validação estática tsc --noEmit em toda a base | T003, T006, T007, T008 | - | `hupflow/` | 🟢 | `[X]` |

---

## Notas de execução

*(Será preenchido durante a execução pelo `/reversa-coding`)*

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
