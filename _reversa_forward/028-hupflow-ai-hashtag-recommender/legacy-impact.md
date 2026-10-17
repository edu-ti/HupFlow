# Análise de Impacto no Sistema: Recomendador de Hashtags com IA & Coleções Salvas

> Identificador da Feature: `028-hupflow-ai-hashtag-recommender`  
> Data: `2026-10-16`  
> Responsável: Equipe de Governança Reversa  

---

## 1. Escopo de Impacto

A Feature 028 introduziu o **Recomendador Inteligente de Hashtags & Gerenciador de Coleções Salvas (Hashtag Sets)** do HupFlow:
- Motor de recomendação semântica com suporte a IA generativa (Vercel AI SDK) e fallback heurístico de alta precisão baseado em dicionários canônicos de 8 nichos.
- Classificação por tiers de alcance (`broad`, `niche`, `community`) com relevância percentual estimada.
- Diretrizes algorítmicas dinâmicas por rede social (`linkedin`, `x`, `instagram`, `threads`) com limites de saturação.
- Persistência multi-tenant de coleções salvas no Drizzle ORM através da tabela `hashtag_sets`.
- Rotas RESTful `/api/ai/hashtags` e `/api/hashtags/sets` protegidas com RBAC (`viewer` e `member`).
- Modal integrado no Compositor `HashtagRecommenderModal.tsx` com injeção em 1 clique e incremento automático de métricas de uso.
- Painel de gerenciamento dedicado em `/settings/hashtags` com filtros instantâneos, tags visuais e atalho no menu lateral (`layout.tsx`).

O impacto é **100% aditivo e seguro**:
- Adição da tabela `hashtag_sets` sem alterar entidades preexistentes.
- Fallback local imediato (< 50ms) caso a chave `OPENAI_API_KEY` esteja ausente.
- Conformidade total com o padrão Clean-Room (zero licenças AGPL, zero dependências proprietárias fechadas).

---

## 2. Matriz de Componentes Afetados

| Componente | Tipo de Modificação | Risco | Mitigação Aplicada |
|------------|---------------------|:-----:|-------------------|
| `hupflow/src/lib/db/schema.ts` | Adição da tabela `hashtag_sets` | Baixo | Chave estrangeira com exclusão em cascata vinculada a `organizations`. |
| `hupflow/src/lib/hashtags/types.ts` | Novo arquivo de tipos e contratos | Mínimo | TypeScript estrito com tipos literais para tiers e redes. |
| `hupflow/src/lib/hashtags/service.ts` | Motor de recomendação e coleções | Baixo | Higienização em PascalCase e fallback semântico offline. |
| `hupflow/src/lib/hashtags/hashtags.test.ts` | Bateria de testes unitários | Mínimo | 100% de cobertura das funções de domínio e guidance. |
| `hupflow/src/app/api/ai/hashtags/route.ts` | Nova rota REST de IA | Baixo | RBAC `viewer` e validação de parâmetros de entrada. |
| `hupflow/src/app/api/hashtags/sets/route.ts` | Nova rota REST para coleções | Baixo | Isolamento multi-tenant por `organizationId` no servidor. |
| `hupflow/src/components/composer/HashtagRecommenderModal.tsx` | Novo modal cliente | Mínimo | Modal acessível com abas e injeção sem perda de foco. |
| `hupflow/src/app/(dashboard)/composer/page.tsx` | Integração do modal no Compositor | Mínimo | Injeção com espaçamento limpo e atualização do estado de rascunho. |
| `hupflow/src/app/(dashboard)/settings/hashtags/page.tsx` | Novo painel de coleções | Mínimo | Interface de gerenciamento isolada. |
| `hupflow/src/app/(dashboard)/layout.tsx` | Inclusão de atalho no menu | Mínimo | Adição do item "Hashtags & IA" com ícone `Hash`. |
