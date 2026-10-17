# Requisitos da Feature: Encurtador de Links & Rastreamento UTM por Canal

> Identificador: `027-hupflow-custom-shortlinks-utm`  
> Data de Criação: `2026-10-16`  
> Autor: Equipe Reversa Forward  
> Status: `requirements`  

---

## 1. Visão Geral & Objetivos de Negócio

Em campanhas de marketing em redes sociais, links longos poluem as legendas, quebram em publicações no X/Twitter e dificultam a atribuição exata de conversões no Google Analytics ou ferramentas de BI.

A **Feature de Encurtador de Links & Rastreamento UTM por Canal** permite que os clientes do HupFlow:
1. **Encurtem URLs de destino automaticamente**: Geração de slugs concisos em Base62 (ex: `/l/s7f9k2`) ou slugs personalizados de marca (ex: `/l/blackfriday`).
2. **Injetem Parâmetros UTM por Rede Social**: Geração automática de variantes de URL com tags `utm_source`, `utm_medium` e `utm_campaign` específicas para Instagram, Threads, LinkedIn e X, permitindo medir qual rede gera mais tráfego e vendas.
3. **Telemetria de Cliques em Tempo Real**: Registro de cada clique com referer, navegador, país/IP e timestamp, sem dependência de serviços externos pagos como Bitly.
4. **Agilidade no Compositor**: Capacidade de criar e copiar links encurtados diretamente para usar nos posts.

---

## 2. Casos de Uso

### UC-01: Criação de Link Encurtado
- Usuário informa URL de destino original (ex: `https://meusite.com.br/produto-especial`).
- Opcionalmente define:
  - Slug personalizado (validação de unicidade e caracteres alfanuméricos com hífen).
  - Parâmetros UTM padrão (`utm_campaign`, `utm_medium`, `utm_content`).
- O sistema gera o slug em Base62 se nenhum for fornecido e persiste em `short_links`.

### UC-02: Gerador de Variantes por Canal Social
- O sistema permite exportar a URL adaptada para cada rede social:
  - Instagram: `...&utm_source=instagram`
  - Threads: `...&utm_source=threads`
  - LinkedIn: `...&utm_source=linkedin`
  - X / Twitter: `...&utm_source=x`

### UC-03: Redirecionamento Público com Rastreamento (`/l/[slug]`)
- Visitante acessa `https://app.hupflow.com/l/xyz123`.
- O servidor localiza o link, incrementa atomicamente o contador `totalClicks`, grava um registro em `short_link_clicks` e executa um redirecionamento HTTP 302 temporário para a URL final com os parâmetros UTM aplicados.

### UC-04: Gestão & Métricas no Painel
- Interface em `/settings/shortlinks` com contadores de cliques, taxa de cliques por canal, botão de cópia em 1 clique e exclusão de links obsoletos.

---

## 3. Critérios de Aceite (DoD)

1. [x] Zero dependências proprietárias ou fechadas; conformidade Clean-Room estrita.
2. [x] Tabelas `short_links` e `short_link_clicks` no schema Drizzle ORM com índices por slug e organização.
3. [x] Rota pública Next.js de redirecionamento `/l/[slug]/route.ts` resiliente com resposta rápida (< 50ms).
4. [x] Rota REST `/api/shortlinks` para criação, listagem com contadores e exclusão com proteção RBAC.
5. [x] Painel visual moderno em `/settings/shortlinks/page.tsx` com gerador de links, prévia de tags UTM e cópia rápida.
6. [x] Atalho "Links & UTMs" integrado ao menu lateral do dashboard (`layout.tsx`).
7. [x] Testes unitários com `tsx` e compilação `tsc --noEmit` com zero erros.
8. [x] Adendo formal `_reversa_sdd/addenda/027-hupflow-custom-shortlinks-utm.md` e sincronização no Reversa.
