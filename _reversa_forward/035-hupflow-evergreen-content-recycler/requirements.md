# Requisitos: Evergreen Content Recycler & Smart Auto-Requeue

> Identificador: `035-hupflow-evergreen-content-recycler`  
> Data: `2026-10-17`  
> Autor: Antigravity (Reversa Autonomous Pipeline)  
> Status: Aprovado  

---

## 1. Contexto & Proposta de Valor
Nas redes sociais modernas (LinkedIn, Instagram, X e Threads), menos de 12% da audiência total de uma marca vê um post no dia em que ele é publicado. Além disso, novos seguidores chegam toda semana e nunca viram os melhores carrosséis, guias e threads publicados há 30, 60 ou 90 dias. No entanto, simplesmente republicar o mesmo texto idêntico em intervalos curtos pode acionar filtros de conteúdo duplicado das plataformas ou cansar a audiência.

O **HupFlow Evergreen Content Recycler & Smart Auto-Requeue** resolve esse problema de forma 100% Clean-Room:
1. **Índice de Perenidade & Performance (`calculateEvergreenScore`)**: Pontua publicações de 0 a 100 combinando taxa de engajamento histórica, formato (carrosséis educativos e listas têm bônus de longevidade) e ausência de marcadores efêmeros/datados (ex: "hoje", "ontem", "Black Friday 2024").
2. **Guardião de Cooldown Anti-Saturação (`isEligibleForRecycle` & `computeNextRecycleSlot`)**: Impede que um item seja republicado antes do intervalo mínimo de descanso (`cooldownDays`, ex: 21, 30 ou 60 dias) ou ultrapasse o teto máximo de ciclos (`maxRecycles`).
3. **Gerador Automático de Variações de Gancho/Copy (`generateSpunVariations`)**: Cria 3 variações de ângulo editorial (*Contrarian/Provocativo*, *Guia Prático/Checklist* e *Pergunta Direta/Storytelling*) para que cada reciclagem pareça uma publicação inédita aos olhos do algoritmo e da audiência.
4. **Painel Gerencial `/settings/evergreen`**: Biblioteca de coleções Evergreen, simulador de variações de copy (`EvergreenVariationCard.tsx`), controle de intervalo de descanso (Cooldown) e botão de reenfileiramento imediato.

---

## 2. Requisitos Funcionais (RF)
- **RF-001**: O sistema deve armazenar itens da biblioteca perene (`evergreen_items`) vinculados ao `organization_id`, contendo: `id`, `title`, `originalCaption`, `category` (`educational`, `case_study`, `framework`, `lead_magnet`), `channels` (JSONB), `mediaType`, `evergreenScore` (0-100), `cooldownDays` (mínimo 7 dias), `recycleCount`, `maxRecycles`, `variations` (JSONB com ângulos alternativos), `lastRecycledAt`, `nextScheduledAt` e `isActive`.
- **RF-002**: O algoritmo `calculateEvergreenScore` deve calcular uma nota de 0 a 100 penalizando textos com datas efêmeras ("amanhã", "nesta sexta", "2023") e bonificando conteúdos estruturados e com bom engajamento.
- **RF-003**: O motor `generateSpunVariations(title, originalCaption)` deve produzir 3 variações distintas de copy prontas para os próximos ciclos de republicação.
- **RF-004**: O verificador `isEligibleForRecycle` deve validar se o item está ativo, abaixo do `maxRecycles` e se o tempo decorrido desde `lastRecycledAt` já cumpriu `cooldownDays`.
- **RF-005**: As rotas REST `/api/evergreen` (`GET`, `POST`, `DELETE`) e `/api/evergreen/recycle` (`POST`) devem operar com controle de acesso RBAC (`viewer` para leitura, `member` para cadastro e disparo de reciclagem).
- **RF-006**: A tela `/settings/evergreen` deve exibir KPIs de economia de tempo e posts reciclados, permitir cadastrar novos itens Evergreen, visualizar as variações no `EvergreenVariationCard.tsx` e disparar a reciclagem inteligente.

---

## 3. Requisitos Não-Funcionais (RNF)
- **RNF-001 (Clean-Room & Zero AGPL)**: Algoritmos de pontuação de perenidade, cálculo de janelas de cooldown e geração de variações 100% autorais em TypeScript.
- **RNF-002 (Isolamento Multi-Tenant)**: Todos os registros são isolados por `organization_id`.
- **RNF-003 (Tipagem Estrita)**: Conformidade 100% validada via `npx tsc --noEmit`.
