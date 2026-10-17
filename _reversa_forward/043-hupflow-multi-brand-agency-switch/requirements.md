# Requisitos — Feature 043: Seletor Rápido & Workspace Switcher de Agência Multi-Marca

## 1. Visão Geral do Módulo
Agências e gestores de tráfego/mídias sociais operam entre 5 e 50+ marcas clientes simultaneamente. O fluxo tradicional de deslogar e relogar ou navegar por menus lentos causa fadiga operacional, perda de contexto e risco de postar na conta errada de outro cliente.

A Feature 043 cria a experiência de **Agency Command Palette & Workspace Switcher**:
- Atalho global de teclado (`Cmd + K` no macOS / `Ctrl + K` no Windows/Linux) para abrir o alternador ultrarrápido em qualquer tela.
- Busca instantânea difusa (fuzzy search) por nome do cliente, nicho (`E-commerce`, `SaaS`, `Saúde`, `Infoproduto`, `Imobiliário`), tags ou slug.
- Gestão de marcas favoritas (`pinned/favorite`) para acesso prioritário com 1 clique.
- Visão de portfólio da agência com métricas de posts pendentes, canais conectados e plano contratado por cliente.
- Alternância de contexto instantânea sem relogin, preservando cookies de autorização e atualizando o tenant ativo em milissegundos.

## 2. Requisitos Funcionais
- **RF01**: Listar todas as marcas/organizações atribuídas ao operador com dados de nicho, canais conectados, status e contagem de posts agendados.
- **RF02**: Filtragem instantânea por texto, tags ou status (`active`, `onboarding`, `paused`).
- **RF03**: Pin/Unpin de marcas clientes favoritas com persistência.
- **RF04**: Alternância de contexto de tenant via chamada atômica `/api/agency/switch`, atualizando cookies de sessão e redirecionando ou atualizando a view.
- **RF05**: Painel de gestão de carteira `/settings/brands` para adicionar novas marcas, atribuir cores de identificação visual, links e limites operacionais.
- **RF06**: Componente `AgencyBrandSwitcherModal.tsx` com atalho de teclado global e acessibilidade de foco.

## 3. Requisitos Não-Funcionais
- **RNF01**: 100% Clean-Room TypeScript sem dependências externas ou SDKs proprietários.
- **RNF02**: Isolamento rigoroso de permissões RBAC (`requireOrgRole`).
- **RNF03**: Resiliência com fallback em memória pré-populado para funcionamento em modo offline/demo.
