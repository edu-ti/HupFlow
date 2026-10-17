# Actions: Encurtador de Links & Rastreamento UTM por Canal

> Identificador: `027-hupflow-custom-shortlinks-utm`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/027-hupflow-custom-shortlinks-utm/roadmap.md`  

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
| T001 | Definir interfaces TypeScript para links, UTMs e estatísticas em types.ts | - | `[//]` | `hupflow/src/lib/shortlinks/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabelas short_links e short_link_clicks no schema.ts | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para gerador Base62, injeção UTM e higienização de URLs | T001 | - | `hupflow/src/lib/shortlinks/shortlinks.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço de encurtamento, UTMs e resolução em service.ts | T001, T002 | - | `hupflow/src/lib/shortlinks/service.ts` | 🟢 | `[x]` |
| T005 | Criar rota REST /api/shortlinks (GET, POST, DELETE) com RBAC | T001, T004 | - | `hupflow/src/app/api/shortlinks/route.ts` | 🟢 | `[x]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar rota pública Next.js de redirecionamento /l/[slug]/route.ts | T004 | `[//]` | `hupflow/src/app/l/[slug]/route.ts` | 🟢 | `[x]` |
| T007 | Criar painel visual de links e UTMs em /settings/shortlinks/page.tsx | T005 | - | `hupflow/src/app/(dashboard)/settings/shortlinks/page.tsx` | 🟢 | `[x]` |
| T008 | Adicionar atalho "Links & UTMs" no menu lateral do dashboard em layout.tsx | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Bateria de testes com tsx, validação estática tsc --noEmit e governança | T003, T005, T006, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |

---

## Notas de execução

- **T001**: Contratos TypeScript estritos definidos com `SocialNetwork`, `UtmParams`, `ShortLink`, `CreateShortLinkInput`, `ShortLinkVariant`, `ShortLinkClickRecord`.
- **T002**: Tabelas `short_links` e `short_link_clicks` no Drizzle ORM com cascade e unicidade de slugs.
- **T003**: Testes unitários com `assert` cobrindo gerador Base62, higienização de slugs, injeção de UTMs e geração de variantes sociais (100% de sucesso via `npx tsx`).
- **T004**: Serviço de encurtamento, resolução com telemetria assíncrona e persistência no banco.
- **T005**: Endpoint REST `/api/shortlinks` com permissões RBAC (`viewer` e `member`).
- **T006**: Rota pública `/l/[slug]` com redirecionamento HTTP 302 e página de fallback 404 estilizada.
- **T007**: Painel visual em `/settings/shortlinks` com filtros de busca, cards de métricas, modal de criação e cópia de URLs para redes sociais.
- **T008**: Adicionado atalho no menu lateral em `layout.tsx` com ícone `Link2`.
- **T009**: Validação completa com `npx tsc --noEmit` resultando em zero erros de compilação; documentação de governança e adendo concluídos.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
| 2026-10-16 | Conclusão e entrega de todas as 9 ações (T001-T009) | reversa-coding |
