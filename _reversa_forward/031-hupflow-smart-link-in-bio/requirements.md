# Requisitos: Smart Link-in-Bio Multi-Link & Showcase

> Identificador: `031-hupflow-smart-link-in-bio`  
> Data: `2026-10-16`  
> Autor: Antigravity (Reversa Autonomous Pipeline)  
> Status: Aprovado  

---

## 1. Contexto & Proposta de Valor
A maioria das redes sociais (Instagram, TikTok, X/Twitter, Threads) restringe o perfil do usuário a apenas um link na biografia ("Link na bio"). Criadores de conteúdo, agências e empresas precisam direcionar seus seguidores para múltiplos destinos (produtos, formulários, comunidade, vídeos do YouTube, links patrocinados, WhatsApp).

O **HupFlow Smart Link-in-Bio** fornece:
1. Uma **página pública ultra-rápida e mobile-first** acessível via `/bio/[handle]` com carregamento instantâneo e zero fricção.
2. **Customização visual completa** (temas predefinidos, cores da marca, fontes, avatar e bio descritiva).
3. **Múltiplos botões de links rápidos** com ícones, destaque animado (pulse/glow), e contagem de cliques.
4. **Vitrine integrada de carrosséis e posts recentes** criados no HupFlow Carousel Studio.
5. **Painel gerencial no dashboard (`/settings/bio`)** com **Simulador Mobile Live Preview** em tempo real e reordenação intuitiva.
6. **Métricas de conversão**: visualizações da página, total de cliques e taxa de cliques (CTR) por botão.

---

## 2. Requisitos Funcionais (RF)
- **RF-001**: O workspace deve ter um perfil de bio único configurado por `handle` (ex: `/bio/minhamarca`), com validação de formato e unicidade no sistema.
- **RF-002**: O perfil de bio deve conter: título, biografia/subtítulo, avatar_url, botões de redes sociais superiores (Instagram, LinkedIn, X, YouTube, TikTok, WhatsApp, etc.), tema visual e estilos customizados.
- **RF-003**: O workspace pode cadastrar múltiplos links em `bio_links`, com título, subtítulo, URL de destino, ícone, estado ativo/inativo, flag de destaque (`is_featured`), e ordem de exibição (`sort_order`).
- **RF-004**: O perfil pode opcionalmente habilitar a seção "Últimos Carrosséis & Posts", exibindo cards com miniaturas dos posts publicados recentemente no workspace.
- **RF-005**: A rota pública `/bio/[handle]` deve renderizar a página responsiva sem exigir autenticação, registrando a visualização da página (view).
- **RF-006**: Ao clicar em um link, um endpoint de telemetria `/api/bio/click` deve registrar o clique de forma não-bloqueante e redirecionar para a URL final.
- **RF-007**: No dashboard (`/settings/bio`), o usuário deve contar com um painel com abas (Links, Aparência, Vitrine, Analytics) e um **Simulador de Smartphone** ao lado que reflete as edições instantaneamente.

---

## 3. Requisitos Não-Funcionais (RNF)
- **RNF-001 (Clean-Room)**: Implementação 100% proprietária TypeScript, sem uso de bibliotecas de terceiros externas com licenças AGPL ou serviços pagos (Linktree, Beacons).
- **RNF-002 (Performance & Core Web Vitals)**: A página pública `/bio/[handle]` deve ser leve, com CSS responsivo nativo, renderização rápida e baixo CLS (Cumulative Layout Shift).
- **RNF-003 (Isolamento Multi-Tenant)**: Todo gerenciamento deve respeitar a chave de partição `workspace_id`.
- **RNF-004 (Tipagem Estrita)**: Conformidade total com `npx tsc --noEmit`.
