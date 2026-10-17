# Roadmap: Encurtador de Links & Rastreamento UTM por Canal

> Identificador: `027-hupflow-custom-shortlinks-utm`  
> Data de Criação: `2026-10-16`  
> Status: `plan`  

---

## 1. Visão Geral das Fases

```
Fase 1 (Preparação) ➔ Fase 2 (Testes) ➔ Fase 3 (Núcleo) ➔ Fase 4 (Redirecionamento & UI) ➔ Fase 5 (Validação & Governança)
```

---

## 2. Detalhamento por Fase

### Fase 1: Preparação & Tipagem
- **T001**: Definir interfaces TypeScript para `ShortLink`, `CreateShortLinkInput`, `ShortLinkVariant` e `ClickStats` em `hupflow/src/lib/shortlinks/types.ts`.
- **T002**: Adicionar tabelas `short_links` e `short_link_clicks` no Drizzle ORM em `hupflow/src/lib/db/schema.ts` com índices por slug e organização.

### Fase 2: Testes
- **T003**: Criar testes unitários em `hupflow/src/lib/shortlinks/shortlinks.test.ts` cobrindo o gerador Base62, injeção de parâmetros UTM com preservação de query parameters existentes e validação de URLs seguras (`http/https`).

### Fase 3: Núcleo de Serviço & Rota REST
- **T004**: Implementar serviço em `hupflow/src/lib/shortlinks/service.ts`:
  - `generateShortSlug`: Geração aleatória de 6 caracteres Base62.
  - `buildUtmUrl`: Montagem segura de URLs com tags por rede social.
  - `createShortLink`: Criação com verificação de colisão de slug.
  - `resolveAndTrackShortLink`: Resolução atômica com tracking.
  - `listShortLinks` e `deleteShortLink`.
- **T005**: Criar rota REST `/api/shortlinks/route.ts` (GET, POST, DELETE).

### Fase 4: Redirecionamento & Interface
- **T006**: Criar rota pública Next.js de redirecionamento em `hupflow/src/app/l/[slug]/route.ts` com HTTP 302 e tracking.
- **T007**: Criar painel visual em `hupflow/src/app/(dashboard)/settings/shortlinks/page.tsx` com gerador de links, prévia de UTM por canal social e estatísticas de cliques.
- **T008**: Adicionar atalho "Links & UTMs" na barra lateral do dashboard em `hupflow/src/app/(dashboard)/layout.tsx`.

### Fase 5: Polimento & Governança
- **T009**: Bateria de testes com `tsx`, validação estática `tsc --noEmit` com zero erros, adendo SDD 027 e sincronização Reversa.
