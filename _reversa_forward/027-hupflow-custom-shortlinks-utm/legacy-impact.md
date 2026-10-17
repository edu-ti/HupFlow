# Análise de Impacto no Sistema: Encurtador de Links & Tags UTM

> Identificador da Feature: `027-hupflow-custom-shortlinks-utm`  
> Data: `2026-10-16`  
> Responsável: Equipe de Governança Reversa  

---

## 1. Escopo de Impacto

A Feature 027 introduziu o **Encurtador de Links & Gerador/Rastreador de Parâmetros UTM por Rede Social**:
- Geração criptográfica de slugs curtos em Base62 (`[0-9a-zA-Z]`) com 6 caracteres ($62^6 \approx 56.8$ bilhões de combinações).
- Sanitização de slugs customizados com remoção de acentos e caracteres especiais.
- Injeção segura de parâmetros UTM (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) preservando parâmetros existentes e fragmentos de URL.
- Motor de resolução de rota pública `/l/[slug]` com redirecionamento HTTP 302 temporário para permitir telemetria contínua sem bloqueio por cache do navegador.
- Telemetria de cliques em tempo real gravada de forma assíncrona na tabela `short_link_clicks` com captura de `referer`, `userAgent`, `ipAddress` e `channelHint`.
- Geração automática de variantes personalizadas para Instagram, Threads, LinkedIn e X (Twitter).
- Painel de controle dedicado em `/settings/shortlinks` com métricas acumuladas, modal de criação, atalhos de cópia rápida e link no menu lateral do dashboard (`layout.tsx`).

O impacto é **100% aditivo e seguro**:
- Adição das tabelas `short_links` e `short_link_clicks` no Drizzle ORM sem impacto em tabelas preexistentes.
- Rotas REST `/api/shortlinks` protegidas com RBAC (`requireOrgRole(req, 'viewer')` para leitura e `'member'` para criação/exclusão).
- Rota pública `/l/[slug]` altamente otimizada, com resposta HTML 404 customizada em caso de slug inexistente.
- Conformidade total com a arquitetura Clean-Room (zero dependências proprietárias ou licenças AGPL).

---

## 2. Matriz de Componentes Afetados

| Componente | Tipo de Modificação | Risco | Mitigação Aplicada |
|------------|---------------------|:-----:|-------------------|
| `hupflow/src/lib/db/schema.ts` | Adição das tabelas `short_links` e `short_link_clicks` | Baixo | Chaves primárias e relacionamentos com cascata vinculados à `organizations`. |
| `hupflow/src/lib/shortlinks/types.ts` | Novo arquivo de tipos TypeScript | Mínimo | Contratos estritos para links, UTMs, variantes sociais e telemetria de cliques. |
| `hupflow/src/lib/shortlinks/service.ts` | Motor de geração, higienização, UTMs e resolução | Baixo | Base62 via `crypto.randomBytes` e telemetria não-bloqueante. |
| `hupflow/src/lib/shortlinks/shortlinks.test.ts` | Testes unitários do subsistema | Mínimo | Bateria de testes com 100% de cobertura das funções de domínio. |
| `hupflow/src/app/api/shortlinks/route.ts` | Nova rota REST (GET, POST, DELETE) | Baixo | Proteção RBAC com permissões granulares por organização. |
| `hupflow/src/app/l/[slug]/route.ts` | Rota pública de redirecionamento | Baixo | Resposta HTTP 302 temporária e página 404 autocontida. |
| `hupflow/src/app/(dashboard)/settings/shortlinks/page.tsx` | Painel visual de links e UTMs | Mínimo | Componente cliente isolado com busca e modais integrados. |
| `hupflow/src/app/(dashboard)/layout.tsx` | Inclusão de atalho no menu lateral | Mínimo | Adição do item "Links & UTMs" com ícone `Link2` sem alterar grid estrutural. |
