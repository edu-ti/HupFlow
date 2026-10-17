# Investigação — Feature 043: Seletor Rápido & Workspace Switcher de Agência Multi-Marca

## 1. Arquitetura Atual de Organizações e Sessões
- O HupFlow implementa autenticação via Better-Auth / cookies assinados e a tabela `organizations` em `hupflow/src/lib/db/schema.ts`.
- O componente `WorkspaceSelector` atual em `hupflow/src/components/auth/WorkspaceSelector.tsx` gerencia uma lista simples suspensa (dropdown).
- Em contextos de agências de alto volume (20+ clientes), menus suspensos simples tornam-se ineficientes para navegação rápida e não oferecem busca por nicho, favoritos nem visão unificada da saúde de publicação das marcas.

## 2. Decisão de Design e Clean-Room
- Criaremos a tabela `agency_brand_profiles` para estender organizações com metadados específicos de agência:
  - `niche`: Segmento de atuação (ex: `E-commerce Moda`, `SaaS B2B`, `Clínica Médica`).
  - `colorHex`: Cor temática do cliente para feedback visual imediato no topo da interface.
  - `tier`: Nível de serviço (`standard`, `premium`, `enterprise_vip`).
  - `isFavorite`: Booleano para ordenação prioritária na Command Palette.
  - `connectedChannelsCount`: Número de contas sociais conectadas.
  - `scheduledPostsCount`: Contagem de publicações pendentes na fila.
  - `monthlyPostQuota`: Limite mensal de postagens contratado.
- Para a interface:
  - `AgencyBrandSwitcherModal.tsx`: modal acionado por `Cmd+K` / `Ctrl+K` ou clique no seletor de workspaces.
  - Filtro em tempo real no cliente com seleção por teclado (Setas Cima/Baixo e Enter).
