// HupFlow Reversa Docs — Unified Offline Data Carrier
// Generated deterministically from seed sha256:44fdd4b2d2727e52edb753257411f5b018475b1fb43237abc1fcfb80a50757a3
window.RV_DATA = {
  projectName: "HupFlow",
  seedShort: "44fdd4b2",
  config: {
    visualStyle: "premium",
    readerProfile: "novo_dev",
    depth: "full"
  },
  nav: [
  {
    "id": "index",
    "href": "index.html",
    "label": "Visão Geral"
  },
  {
    "id": "arquitetura",
    "href": "arquitetura.html",
    "label": "Arquitetura 3D"
  },
  {
    "id": "modulos",
    "href": "modulos.html",
    "label": "Módulos & Grafo"
  },
  {
    "id": "topologia",
    "href": "topologia.html",
    "label": "Topologia"
  },
  {
    "id": "metricas",
    "href": "metricas.html",
    "label": "Métricas"
  },
  {
    "id": "glossario",
    "href": "glossario.html",
    "label": "Glossário"
  },
  {
    "id": "deck",
    "href": "deck.html",
    "label": "Slide Deck"
  },
  {
    "id": "adendos",
    "href": "adendos.html",
    "label": "Evolução & Adendos"
  }
],
  modules: [
  {
    "id": "carousel-generator/actions.tsx",
    "name": "src/app/actions.tsx",
    "folder": "carousel-generator",
    "loc": 215,
    "complexity": 12,
    "type": "server-action",
    "subsystem": "carousel-generator",
    "description": "Orquestrador de geração de slides via LangChain com Rate Limiting e BYOK fallback"
  },
  {
    "id": "carousel-generator/langchain.ts",
    "name": "src/lib/langchain.ts",
    "folder": "carousel-generator",
    "loc": 280,
    "complexity": 16,
    "type": "ai-service",
    "subsystem": "carousel-generator",
    "description": "Integração OpenAI gpt-4o-mini com function calling Zod e tratamento de fallback dinâmico"
  },
  {
    "id": "carousel-generator/slides-editor.tsx",
    "name": "src/components/slides-editor.tsx",
    "folder": "carousel-generator",
    "loc": 390,
    "complexity": 14,
    "type": "ui-component",
    "subsystem": "carousel-generator",
    "description": "Editor visual de carrosséis interativo com personalização de cores, fontes e layout"
  },
  {
    "id": "carousel-generator/rate-limit.ts",
    "name": "src/lib/rate-limit.ts",
    "folder": "carousel-generator",
    "loc": 85,
    "complexity": 6,
    "type": "security",
    "subsystem": "carousel-generator",
    "description": "Limitador de requisições por IP via Upstash Redis KV com respostas estruturadas"
  },
  {
    "id": "carousel-generator/fonts-map.tsx",
    "name": "src/lib/fonts-map.tsx",
    "folder": "carousel-generator",
    "loc": 140,
    "complexity": 4,
    "type": "ui-asset",
    "subsystem": "carousel-generator",
    "description": "Mapeamento e carregamento dinâmico de webfonts para slides"
  },
  {
    "id": "carousel-generator/pdf-export.tsx",
    "name": "src/components/pdf-export.tsx",
    "folder": "carousel-generator",
    "loc": 190,
    "complexity": 8,
    "type": "exporter",
    "subsystem": "carousel-generator",
    "description": "Renderização e compilação vetorial PDF de slides via @react-pdf/renderer"
  },
  {
    "id": "polotno-studio/main.ts",
    "name": "src/main/index.ts",
    "folder": "polotno-studio",
    "loc": 340,
    "complexity": 15,
    "type": "electron-main",
    "subsystem": "polotno-studio",
    "description": "Processo principal Electron, gerenciamento de janelas, ciclo de vida e IPC bridge"
  },
  {
    "id": "polotno-studio/mcp-server.ts",
    "name": "src/mcp-server/index.ts",
    "folder": "polotno-studio",
    "loc": 410,
    "complexity": 18,
    "type": "mcp-server",
    "subsystem": "polotno-studio",
    "description": "Servidor MCP (Model Context Protocol) via JSON-RPC/stdio para automação IA"
  },
  {
    "id": "polotno-studio/postiz-bridge.ts",
    "name": "src/mcp-server/postiz-bridge.ts",
    "folder": "polotno-studio",
    "loc": 185,
    "complexity": 9,
    "type": "integration",
    "subsystem": "polotno-studio",
    "description": "Bridge MCP 'export_to_postiz' para upload direto de designs renderizados para o Postiz"
  },
  {
    "id": "polotno-studio/renderer-app.tsx",
    "name": "src/renderer/src/App.tsx",
    "folder": "polotno-studio",
    "loc": 520,
    "complexity": 22,
    "type": "ui-editor",
    "subsystem": "polotno-studio",
    "description": "Container do estúdio Polotno com MobX 7 store, abas e Konva canvas 2D"
  },
  {
    "id": "polotno-studio/tabs-manager.ts",
    "name": "src/renderer/src/tabs-store.ts",
    "folder": "polotno-studio",
    "loc": 230,
    "complexity": 11,
    "type": "state-store",
    "subsystem": "polotno-studio",
    "description": "Gerenciador multi-abas de designs abertos com histórico isolado de undo/redo"
  },
  {
    "id": "polotno-studio/design-lint.ts",
    "name": "src/renderer/src/lint-engine.ts",
    "folder": "polotno-studio",
    "loc": 295,
    "complexity": 13,
    "type": "linter",
    "subsystem": "polotno-studio",
    "description": "Verificador algorítmico de contraste WCAG, texto fora da sangria e proporções"
  },
  {
    "id": "postiz-backend/main.ts",
    "name": "apps/backend/src/main.ts",
    "folder": "postiz-backend",
    "loc": 115,
    "complexity": 6,
    "type": "entrypoint",
    "subsystem": "postiz-backend",
    "description": "Bootstrap do servidor NestJS, CORS, Swagger OpenAPI e graceful shutdown"
  },
  {
    "id": "postiz-backend/auth-middleware.ts",
    "name": "apps/backend/src/api/auth.middleware.ts",
    "folder": "postiz-backend",
    "loc": 180,
    "complexity": 12,
    "type": "middleware",
    "subsystem": "postiz-backend",
    "description": "Middleware de validação JWT, isolamento multi-tenant e verificação de OrganizationId"
  },
  {
    "id": "postiz-backend/posts-controller.ts",
    "name": "apps/backend/src/api/routes/posts.controller.ts",
    "folder": "postiz-backend",
    "loc": 460,
    "complexity": 24,
    "type": "controller",
    "subsystem": "postiz-backend",
    "description": "API REST CRUD de publicações com agendamento, upload de mídia e tags"
  },
  {
    "id": "postiz-backend/integrations-controller.ts",
    "name": "apps/backend/src/api/routes/integrations.controller.ts",
    "folder": "postiz-backend",
    "loc": 380,
    "complexity": 19,
    "type": "controller",
    "subsystem": "postiz-backend",
    "description": "Gerenciamento de canais sociais conectados e fluxos de callback OAuth"
  },
  {
    "id": "postiz-backend/organizations-controller.ts",
    "name": "apps/backend/src/api/routes/organizations.controller.ts",
    "folder": "postiz-backend",
    "loc": 270,
    "complexity": 14,
    "type": "controller",
    "subsystem": "postiz-backend",
    "description": "Fronteira multi-tenant, gestão de membros, permissões RBAC e faturamento"
  },
  {
    "id": "postiz-backend/uploads-controller.ts",
    "name": "apps/backend/src/api/routes/uploads.controller.ts",
    "folder": "postiz-backend",
    "loc": 220,
    "complexity": 10,
    "type": "controller",
    "subsystem": "postiz-backend",
    "description": "Upload multipart de imagens e vídeos para armazenamento local ou S3/R2"
  },
  {
    "id": "postiz-backend/prisma-service.ts",
    "name": "apps/backend/src/services/prisma.service.ts",
    "folder": "postiz-backend",
    "loc": 95,
    "complexity": 5,
    "type": "orm-service",
    "subsystem": "postiz-backend",
    "description": "Conexão e lifecycle do cliente Prisma ORM com PostgreSQL"
  },
  {
    "id": "postiz-orchestrator/main.ts",
    "name": "apps/orchestrator/src/main.ts",
    "folder": "postiz-orchestrator",
    "loc": 90,
    "complexity": 5,
    "type": "temporal-worker",
    "subsystem": "postiz-orchestrator",
    "description": "Worker Temporal.io registrando workflows e activities de envio social"
  },
  {
    "id": "postiz-orchestrator/post-workflow.ts",
    "name": "apps/orchestrator/src/workflows/post.workflow.ts",
    "folder": "postiz-orchestrator",
    "loc": 310,
    "complexity": 17,
    "type": "workflow",
    "subsystem": "postiz-orchestrator",
    "description": "Workflow durável idempotente de envio de posts para múltiplos canais"
  },
  {
    "id": "postiz-orchestrator/token-refresh.ts",
    "name": "apps/orchestrator/src/workflows/token-refresh.workflow.ts",
    "folder": "postiz-orchestrator",
    "loc": 195,
    "complexity": 11,
    "type": "workflow",
    "subsystem": "postiz-orchestrator",
    "description": "Workflow autônomo de renovação contínua de tokens OAuth expirados"
  },
  {
    "id": "postiz-orchestrator/publish-activity.ts",
    "name": "apps/orchestrator/src/activities/publish.activity.ts",
    "folder": "postiz-orchestrator",
    "loc": 280,
    "complexity": 15,
    "type": "activity",
    "subsystem": "postiz-orchestrator",
    "description": "Atividade de execução de dispatch com fallback e telemetria de erro por canal"
  },
  {
    "id": "postiz-libs/social-abstract.ts",
    "name": "libraries/nestjs-libraries/src/integrations/social.abstract.ts",
    "folder": "postiz-libs",
    "loc": 680,
    "complexity": 32,
    "type": "abstract-provider",
    "subsystem": "postiz-libs",
    "description": "Interface unificada e validador polimórfico para 38 provedores de redes sociais"
  },
  {
    "id": "postiz-libs/twitter-connector.ts",
    "name": "libraries/nestjs-libraries/src/integrations/twitter.provider.ts",
    "folder": "postiz-libs",
    "loc": 340,
    "complexity": 16,
    "type": "social-connector",
    "subsystem": "postiz-libs",
    "description": "Conector Twitter/X API v2 com upload de mídia em chunks e tweets longos"
  },
  {
    "id": "postiz-libs/linkedin-connector.ts",
    "name": "libraries/nestjs-libraries/src/integrations/linkedin.provider.ts",
    "folder": "postiz-libs",
    "loc": 360,
    "complexity": 17,
    "type": "social-connector",
    "subsystem": "postiz-libs",
    "description": "Conector LinkedIn REST com suporte a publicações corporativas e pessoais"
  },
  {
    "id": "postiz-libs/instagram-connector.ts",
    "name": "libraries/nestjs-libraries/src/integrations/instagram.provider.ts",
    "folder": "postiz-libs",
    "loc": 420,
    "complexity": 20,
    "type": "social-connector",
    "subsystem": "postiz-libs",
    "description": "Conector Meta Graph API para feed, carrosséis e reels de contas Creator"
  },
  {
    "id": "postiz-libs/tiktok-connector.ts",
    "name": "libraries/nestjs-libraries/src/integrations/tiktok.provider.ts",
    "folder": "postiz-libs",
    "loc": 310,
    "complexity": 15,
    "type": "social-connector",
    "subsystem": "postiz-libs",
    "description": "Conector TikTok Content Posting API para agendamento direto de vídeo"
  },
  {
    "id": "postiz-libs/bluesky-connector.ts",
    "name": "libraries/nestjs-libraries/src/integrations/bluesky.provider.ts",
    "folder": "postiz-libs",
    "loc": 290,
    "complexity": 13,
    "type": "social-connector",
    "subsystem": "postiz-libs",
    "description": "Conector ATProto federado com facets de menções e embeds de imagem"
  },
  {
    "id": "postiz-frontend/layout.tsx",
    "name": "apps/frontend/src/app/layout.tsx",
    "folder": "postiz-frontend",
    "loc": 240,
    "complexity": 10,
    "type": "ui-layout",
    "subsystem": "postiz-frontend",
    "description": "Layout raiz Next.js 16 com Mantine Theme Provider, sidebar e header"
  },
  {
    "id": "postiz-frontend/calendar.tsx",
    "name": "apps/frontend/src/components/calendar/view.tsx",
    "folder": "postiz-frontend",
    "loc": 580,
    "complexity": 26,
    "type": "ui-calendar",
    "subsystem": "postiz-frontend",
    "description": "Calendário editorial interativo com drag-and-drop de posts e visão semanal/mensal"
  },
  {
    "id": "postiz-frontend/post-composer.tsx",
    "name": "apps/frontend/src/components/posts/composer.tsx",
    "folder": "postiz-frontend",
    "loc": 640,
    "complexity": 28,
    "type": "ui-composer",
    "subsystem": "postiz-frontend",
    "description": "Editor multicanal de postagens com preview em tempo real de cada rede social"
  },
  {
    "id": "postiz-frontend/analytics.tsx",
    "name": "apps/frontend/src/components/analytics/dashboard.tsx",
    "folder": "postiz-frontend",
    "loc": 390,
    "complexity": 18,
    "type": "ui-analytics",
    "subsystem": "postiz-frontend",
    "description": "Dashboards analíticos de engajamento, impressões, cliques e streak da organização"
  }
],
  deps: {
  "nodes": [
    {
      "id": "carousel-generator",
      "label": "Carousel Generator (Web Next.js)",
      "subsystem": "carousel",
      "loc": 5800
    },
    {
      "id": "openai-api",
      "label": "OpenAI API (gpt-4o-mini)",
      "subsystem": "external-ai",
      "loc": 0
    },
    {
      "id": "upstash-redis",
      "label": "Upstash Redis (Rate Limiter)",
      "subsystem": "cache",
      "loc": 0
    },
    {
      "id": "polotno-studio",
      "label": "Polotno Studio (Desktop Electron)",
      "subsystem": "polotno",
      "loc": 14500
    },
    {
      "id": "polotno-mcp",
      "label": "Polotno MCP Server",
      "subsystem": "polotno-mcp",
      "loc": 2600
    },
    {
      "id": "ai-agents",
      "label": "Agentes de IA (Claude/Antigravity)",
      "subsystem": "external-ai",
      "loc": 0
    },
    {
      "id": "postiz-frontend",
      "label": "Postiz Frontend (Next.js 16)",
      "subsystem": "postiz-web",
      "loc": 11800
    },
    {
      "id": "postiz-backend",
      "label": "Postiz Backend (NestJS 11)",
      "subsystem": "postiz-api",
      "loc": 14200
    },
    {
      "id": "postiz-orchestrator",
      "label": "Postiz Orchestrator (Temporal.io)",
      "subsystem": "postiz-orch",
      "loc": 5100
    },
    {
      "id": "postiz-libs",
      "label": "NestJS Libraries (38 Conectores)",
      "subsystem": "postiz-libs",
      "loc": 32400
    },
    {
      "id": "postgres-db",
      "label": "PostgreSQL Database (Prisma)",
      "subsystem": "storage",
      "loc": 0
    },
    {
      "id": "temporal-server",
      "label": "Temporal Server (gRPC)",
      "subsystem": "messaging",
      "loc": 0
    },
    {
      "id": "social-networks",
      "label": "Redes Sociais (38 Provedores)",
      "subsystem": "external-social",
      "loc": 0
    }
  ],
  "edges": [
    {
      "from": "carousel-generator",
      "to": "openai-api",
      "weight": 3,
      "label": "LangChain Chat / Structured Prompts"
    },
    {
      "from": "carousel-generator",
      "to": "upstash-redis",
      "weight": 2,
      "label": "IP Rate Limiting"
    },
    {
      "from": "carousel-generator",
      "to": "postiz-frontend",
      "weight": 2,
      "label": "Export PDF / Imagens"
    },
    {
      "from": "ai-agents",
      "to": "polotno-mcp",
      "weight": 4,
      "label": "MCP JSON-RPC Tools"
    },
    {
      "from": "polotno-mcp",
      "to": "polotno-studio",
      "weight": 4,
      "label": "IPC Bridge Canvas Mutation"
    },
    {
      "from": "polotno-studio",
      "to": "postiz-backend",
      "weight": 3,
      "label": "export_to_postiz REST Upload"
    },
    {
      "from": "postiz-frontend",
      "to": "postiz-backend",
      "weight": 5,
      "label": "REST API / JWT Auth"
    },
    {
      "from": "postiz-backend",
      "to": "postgres-db",
      "weight": 5,
      "label": "Prisma ORM Queries"
    },
    {
      "from": "postiz-backend",
      "to": "postiz-orchestrator",
      "weight": 4,
      "label": "Temporal Client StartWorkflow"
    },
    {
      "from": "postiz-orchestrator",
      "to": "temporal-server",
      "weight": 5,
      "label": "Worker Activity Dispatch"
    },
    {
      "from": "postiz-orchestrator",
      "to": "postiz-libs",
      "weight": 5,
      "label": "Social Abstract Dispatch"
    },
    {
      "from": "postiz-libs",
      "to": "social-networks",
      "weight": 5,
      "label": "OAuth REST / Graph APIs"
    }
  ],
  "cycles": []
},
  metrics: {
  "schemaVersion": 1,
  "generatedAt": "2026-10-14T20:40:00-03:00",
  "totalFiles": 1801,
  "totalLoc": 85400,
  "confidenceScore": 91.5,
  "treemap_loc_by_folder": [
    {
      "folder": "postiz/libraries (38 Conectores)",
      "loc": 32400,
      "modules": 48,
      "color": "#3b82f6"
    },
    {
      "folder": "postiz/apps/backend (NestJS API)",
      "loc": 14200,
      "modules": 36,
      "color": "#6366f1"
    },
    {
      "folder": "_reversa_sdd (Documentação SDD)",
      "loc": 14200,
      "modules": 28,
      "color": "#06b6d4"
    },
    {
      "folder": "polotno-studio/renderer (Konva Canvas)",
      "loc": 12500,
      "modules": 32,
      "color": "#8b5cf6"
    },
    {
      "folder": "postiz/apps/frontend (Next.js Web)",
      "loc": 11800,
      "modules": 42,
      "color": "#0ea5e9"
    },
    {
      "folder": "carousel-generator/src (Next.js AI)",
      "loc": 5800,
      "modules": 18,
      "color": "#ec4899"
    },
    {
      "folder": "postiz/apps/orchestrator (Temporal)",
      "loc": 5100,
      "modules": 16,
      "color": "#10b981"
    },
    {
      "folder": "polotno-studio/mcp-server (Protocol)",
      "loc": 2600,
      "modules": 8,
      "color": "#f59e0b"
    }
  ],
  "top_complexity": [
    {
      "id": "postiz-libs/social.abstract.ts",
      "complexity": 32,
      "loc": 680,
      "subsystem": "postiz-libs"
    },
    {
      "id": "postiz-frontend/composer.tsx",
      "complexity": 28,
      "loc": 640,
      "subsystem": "postiz-frontend"
    },
    {
      "id": "postiz-frontend/calendar.tsx",
      "complexity": 26,
      "loc": 580,
      "subsystem": "postiz-frontend"
    },
    {
      "id": "postiz-backend/posts.controller.ts",
      "complexity": 24,
      "loc": 460,
      "subsystem": "postiz-backend"
    },
    {
      "id": "polotno-studio/App.tsx",
      "complexity": 22,
      "loc": 520,
      "subsystem": "polotno-studio"
    },
    {
      "id": "postiz-libs/instagram.provider.ts",
      "complexity": 20,
      "loc": 420,
      "subsystem": "postiz-libs"
    },
    {
      "id": "postiz-backend/integrations.controller.ts",
      "complexity": 19,
      "loc": 380,
      "subsystem": "postiz-backend"
    },
    {
      "id": "polotno-studio/mcp-server/index.ts",
      "complexity": 18,
      "loc": 410,
      "subsystem": "polotno-studio"
    },
    {
      "id": "postiz-frontend/analytics.tsx",
      "complexity": 18,
      "loc": 390,
      "subsystem": "postiz-frontend"
    },
    {
      "id": "postiz-orchestrator/post.workflow.ts",
      "complexity": 17,
      "loc": 310,
      "subsystem": "postiz-orchestrator"
    },
    {
      "id": "postiz-libs/linkedin.provider.ts",
      "complexity": 17,
      "loc": 360,
      "subsystem": "postiz-libs"
    },
    {
      "id": "carousel-generator/langchain.ts",
      "complexity": 16,
      "loc": 280,
      "subsystem": "carousel-generator"
    },
    {
      "id": "postiz-libs/twitter.provider.ts",
      "complexity": 16,
      "loc": 340,
      "subsystem": "postiz-libs"
    },
    {
      "id": "polotno-studio/main/index.ts",
      "complexity": 15,
      "loc": 340,
      "subsystem": "polotno-studio"
    },
    {
      "id": "carousel-generator/actions.tsx",
      "complexity": 12,
      "loc": 215,
      "subsystem": "carousel-generator"
    }
  ],
  "loc_histogram": {
    "bins": [
      "0-50",
      "51-100",
      "101-200",
      "201-500",
      "501-1000",
      "1000+"
    ],
    "counts": [
      420,
      280,
      150,
      85,
      25,
      6
    ]
  },
  "dependency_sankey": {
    "nodes": [
      {
        "id": "Criador / Usuário"
      },
      {
        "id": "Carousel Generator"
      },
      {
        "id": "Polotno Studio"
      },
      {
        "id": "Polotno MCP Server"
      },
      {
        "id": "Agentes LLM"
      },
      {
        "id": "Postiz Frontend"
      },
      {
        "id": "Postiz Backend"
      },
      {
        "id": "PostgreSQL Prisma"
      },
      {
        "id": "Temporal Orchestrator"
      },
      {
        "id": "Social Connectors (38)"
      },
      {
        "id": "Redes Sociais Finais"
      }
    ],
    "links": [
      {
        "source": "Criador / Usuário",
        "target": "Carousel Generator",
        "value": 20
      },
      {
        "source": "Criador / Usuário",
        "target": "Polotno Studio",
        "value": 35
      },
      {
        "source": "Criador / Usuário",
        "target": "Postiz Frontend",
        "value": 45
      },
      {
        "source": "Agentes LLM",
        "target": "Polotno MCP Server",
        "value": 30
      },
      {
        "source": "Polotno MCP Server",
        "target": "Polotno Studio",
        "value": 30
      },
      {
        "source": "Carousel Generator",
        "target": "Postiz Frontend",
        "value": 15
      },
      {
        "source": "Polotno Studio",
        "target": "Postiz Backend",
        "value": 25
      },
      {
        "source": "Postiz Frontend",
        "target": "Postiz Backend",
        "value": 60
      },
      {
        "source": "Postiz Backend",
        "target": "PostgreSQL Prisma",
        "value": 50
      },
      {
        "source": "Postiz Backend",
        "target": "Temporal Orchestrator",
        "value": 40
      },
      {
        "source": "Temporal Orchestrator",
        "target": "Social Connectors (38)",
        "value": 40
      },
      {
        "source": "Social Connectors (38)",
        "target": "Redes Sociais Finais",
        "value": 40
      }
    ]
  },
  "language_distribution": [
    {
      "language": "TypeScript (.ts, .tsx)",
      "files": 966,
      "percent": 53.6,
      "loc": 58400,
      "color": "#3178c6"
    },
    {
      "language": "Markdown / SDD (.md)",
      "files": 348,
      "percent": 19.3,
      "loc": 14200,
      "color": "#0891b2"
    },
    {
      "language": "Configurações CI/CD (.yaml)",
      "files": 181,
      "percent": 10.1,
      "loc": 5200,
      "color": "#f59e0b"
    },
    {
      "language": "Manifestos e Dados (.json)",
      "files": 95,
      "percent": 5.3,
      "loc": 4800,
      "color": "#10b981"
    },
    {
      "language": "JavaScript (.js, .mjs)",
      "files": 25,
      "percent": 1.4,
      "loc": 1800,
      "color": "#facc15"
    },
    {
      "language": "Prisma Schema (.prisma)",
      "files": 1,
      "percent": 0.1,
      "loc": 1840,
      "color": "#4f46e5"
    },
    {
      "language": "Python & Shell (.py, .sh)",
      "files": 11,
      "percent": 0.6,
      "loc": 800,
      "color": "#ec4899"
    },
    {
      "language": "Outros & Ativos (.css, .svg)",
      "files": 174,
      "percent": 9.7,
      "loc": 1200,
      "color": "#64748b"
    }
  ]
},
  soul: {
  "projectName": "HupFlow",
  "tagline": "Suíte unificada de marketing digital, design com IA, e distribuição social para 38 redes.",
  "purpose": "O HupFlow unifica a produção de criativos visuais (carrosséis estruturados e estúdio 2D desktop via MCP) com uma esteira corporativa robusta de agendamento multicanal para 38 redes sociais com workflows duráveis.",
  "coreEntities": [
    {
      "term": "Organization",
      "definition": "Fronteira multi-tenant primária. Usuários, integrações, posts e assinaturas pertencem estritamente a uma organização com isolamento absoluto.",
      "domain": "postiz",
      "status": "confirmado",
      "id": "organization"
    },
    {
      "term": "Post",
      "definition": "Unidade editorial contendo texto (copy), mídias anexadas, tags e agendamento para um ou múltiplos canais sociais.",
      "domain": "postiz",
      "status": "confirmado",
      "id": "post"
    },
    {
      "term": "Integration",
      "definition": "Canal social conectado (perfil pessoal ou página corporativa) com credenciais OAuth autorizadas e refresh automático.",
      "domain": "postiz",
      "status": "confirmado",
      "id": "integration"
    },
    {
      "term": "Set",
      "definition": "Grupo predefinido de canais sociais que recebem publicações simultâneas com apenas 1 clique.",
      "domain": "postiz",
      "status": "confirmado",
      "id": "set"
    },
    {
      "term": "Streak",
      "definition": "Métrica de gamificação e consistência que contabiliza dias ininterruptos de postagens públicas.",
      "domain": "postiz",
      "status": "confirmado",
      "id": "streak"
    },
    {
      "term": "Design",
      "definition": "Documento visual individual no Polotno Studio contendo uma ou mais páginas com elementos gráficos ordenados.",
      "domain": "polotno",
      "status": "confirmado",
      "id": "design"
    },
    {
      "term": "Design JSON",
      "definition": "Representação serializada pura do design em JSON compatível com store.toJSON() e com @polotno/schema.",
      "domain": "polotno",
      "status": "confirmado",
      "id": "design-json"
    },
    {
      "term": "Model Context Protocol (MCP)",
      "definition": "Servidor de protocolo aberto que permite a agentes de IA manipular o canvas, injetar imagens e acionar ferramentas no Polotno.",
      "domain": "polotno",
      "status": "confirmado",
      "id": "mcp"
    },
    {
      "term": "Carousel",
      "definition": "Sequência de slides horizontais com copy de alto impacto gerada por IA (LangChain) para LinkedIn e Instagram.",
      "domain": "carousel",
      "status": "confirmado",
      "id": "carousel"
    },
    {
      "term": "Slide",
      "definition": "Lâmina individual do carrossel composta por blocos de texto (Title, Subtitle, Description) e tema visual.",
      "domain": "carousel",
      "status": "confirmado",
      "id": "slide"
    },
    {
      "term": "BYOK (Bring Your Own Key)",
      "definition": "Mecanismo de fallback que permite ao usuário informar sua própria chave da OpenAI quando a cota do servidor estiver esgotada.",
      "domain": "carousel",
      "status": "confirmado",
      "id": "byok"
    },
    {
      "term": "Postiz Bridge",
      "definition": "Ferramenta MCP (export_to_postiz) que renderiza o design ativo em alta resolução e o envia diretamente para o backend do Postiz.",
      "domain": "bridge",
      "status": "confirmado",
      "id": "postiz-bridge"
    }
  ],
  "businessRules": [
    {
      "id": "RN-01",
      "name": "Isolamento Rigoroso Multi-tenant",
      "desc": "Nenhuma consulta ou mutação pode ser executada sem filtrar explicitamente pelo organizationId da sessão ativa. Tentativas de acesso cruzado geram HTTP 403."
    },
    {
      "id": "RN-02",
      "name": "Garantia de Limites de Texto e Mídia",
      "desc": "Cada rede social possui restrições aplicadas na validação prévia (Twitter 280 chars, LinkedIn 3.000 chars, Instagram mídias com proporções 4:5, 1:1, 9:16)."
    },
    {
      "id": "RN-03",
      "name": "Renovação Autônoma de Credenciais OAuth",
      "desc": "Workflows assíncronos renovam access tokens com janela de expiração menor que 24 horas via refresh token antes do disparo de posts."
    },
    {
      "id": "RN-04",
      "name": "Idempotência de Publicação via Temporal",
      "desc": "O WorkflowId do Temporal é amarrado deterministicamente ao PostId, prevenindo envios duplicados em caso de timeout de rede."
    },
    {
      "id": "RN-05",
      "name": "Rate Limiting com Feedback Estruturado",
      "desc": "Proteção contra abusos via Upstash Redis retornando mensagens amigáveis de erro e opção BYOK para o usuário."
    },
    {
      "id": "RN-06",
      "name": "Estrutura Harmônica de Carrosséis",
      "desc": "Geração via LLM estruturada em 8 a 15 lâminas com contagem de caracteres balanceada para leitura em dispositivos móveis."
    }
  ],
  "foundingDecisions": [
    {
      "title": "Workflows Duráveis com Temporal.io",
      "desc": "Substituição de cron jobs tradicionais por workflows duráveis que sobrevivem a reinicializações de pods e falhas transitórias de APIs externas."
    },
    {
      "title": "Protocolo MCP para Agentes de IA",
      "desc": "Adoção do Model Context Protocol aberto no Polotno Studio para integração transparente com assistentes e ferramentas autônomas."
    },
    {
      "title": "Conector Unificado Social Abstract",
      "desc": "Normalização de 38 redes sociais heterogêneas sob uma interface polimórfica compartilhada em TypeScript."
    }
  ]
},
  glossary: [
  {
    "term": "Organization",
    "definition": "Fronteira multi-tenant primária. Usuários, integrações, posts e assinaturas pertencem estritamente a uma organização com isolamento absoluto.",
    "domain": "postiz",
    "status": "confirmado",
    "id": "organization"
  },
  {
    "term": "Post",
    "definition": "Unidade editorial contendo texto (copy), mídias anexadas, tags e agendamento para um ou múltiplos canais sociais.",
    "domain": "postiz",
    "status": "confirmado",
    "id": "post"
  },
  {
    "term": "Integration",
    "definition": "Canal social conectado (perfil pessoal ou página corporativa) com credenciais OAuth autorizadas e refresh automático.",
    "domain": "postiz",
    "status": "confirmado",
    "id": "integration"
  },
  {
    "term": "Set",
    "definition": "Grupo predefinido de canais sociais que recebem publicações simultâneas com apenas 1 clique.",
    "domain": "postiz",
    "status": "confirmado",
    "id": "set"
  },
  {
    "term": "Streak",
    "definition": "Métrica de gamificação e consistência que contabiliza dias ininterruptos de postagens públicas.",
    "domain": "postiz",
    "status": "confirmado",
    "id": "streak"
  },
  {
    "term": "Design",
    "definition": "Documento visual individual no Polotno Studio contendo uma ou mais páginas com elementos gráficos ordenados.",
    "domain": "polotno",
    "status": "confirmado",
    "id": "design"
  },
  {
    "term": "Design JSON",
    "definition": "Representação serializada pura do design em JSON compatível com store.toJSON() e com @polotno/schema.",
    "domain": "polotno",
    "status": "confirmado",
    "id": "design-json"
  },
  {
    "term": "Model Context Protocol (MCP)",
    "definition": "Servidor de protocolo aberto que permite a agentes de IA manipular o canvas, injetar imagens e acionar ferramentas no Polotno.",
    "domain": "polotno",
    "status": "confirmado",
    "id": "mcp"
  },
  {
    "term": "Carousel",
    "definition": "Sequência de slides horizontais com copy de alto impacto gerada por IA (LangChain) para LinkedIn e Instagram.",
    "domain": "carousel",
    "status": "confirmado",
    "id": "carousel"
  },
  {
    "term": "Slide",
    "definition": "Lâmina individual do carrossel composta por blocos de texto (Title, Subtitle, Description) e tema visual.",
    "domain": "carousel",
    "status": "confirmado",
    "id": "slide"
  },
  {
    "term": "BYOK (Bring Your Own Key)",
    "definition": "Mecanismo de fallback que permite ao usuário informar sua própria chave da OpenAI quando a cota do servidor estiver esgotada.",
    "domain": "carousel",
    "status": "confirmado",
    "id": "byok"
  },
  {
    "term": "Postiz Bridge",
    "definition": "Ferramenta MCP (export_to_postiz) que renderiza o design ativo em alta resolução e o envia diretamente para o backend do Postiz.",
    "domain": "bridge",
    "status": "confirmado",
    "id": "postiz-bridge"
  }
],
  featuresIndex: [
  {
    "slug": "carousel-generator",
    "title": "Carousel Generator",
    "description": "Gerador especializado de carrosséis para LinkedIn e Instagram via LangChain e Upstash Redis.",
    "subsystem": "carousel",
    "filesCount": 18,
    "loc": 5800
  },
  {
    "slug": "polotno-studio-core",
    "title": "Polotno Studio Core",
    "description": "Estúdio de design gráfico 2D offline-first desktop/web baseado em Electron, Konva e MobX.",
    "subsystem": "polotno",
    "filesCount": 32,
    "loc": 12500
  },
  {
    "slug": "polotno-mcp-server",
    "title": "Polotno MCP Server",
    "description": "Servidor nativo Model Context Protocol para controle autônomo do editor por agentes de IA.",
    "subsystem": "polotno-mcp",
    "filesCount": 8,
    "loc": 2600
  },
  {
    "slug": "postiz-backend-api",
    "title": "Postiz Backend API",
    "description": "API REST corporativa NestJS com Prisma ORM, isolamento multi-tenant e billing Stripe.",
    "subsystem": "postiz-api",
    "filesCount": 36,
    "loc": 14200
  },
  {
    "slug": "postiz-frontend-web",
    "title": "Postiz Frontend Web",
    "description": "Interface editorial moderna Next.js 16 com calendário drag-and-drop e visualização de analytics.",
    "subsystem": "postiz-web",
    "filesCount": 42,
    "loc": 11800
  },
  {
    "slug": "postiz-orchestrator",
    "title": "Postiz Orchestrator",
    "description": "Worker Temporal.io para agendamento idempotente e orquestração durável de disparos.",
    "subsystem": "postiz-orch",
    "filesCount": 16,
    "loc": 5100
  },
  {
    "slug": "postiz-integrations-libraries",
    "title": "Postiz Integrations & Libs",
    "description": "Biblioteca compartilhada em TypeScript contendo 38 conectores para redes sociais.",
    "subsystem": "postiz-libs",
    "filesCount": 48,
    "loc": 32400
  }
],
  addenda: [
  {
    "id": "001-rate-limit-feedback",
    "title": "Rate Limit Feedback Estruturado",
    "feature": "carousel-generator",
    "status": "concluido",
    "desc": "Substituição do retorno genérico null por mensagens amigáveis de erro e indicação de cota esgotada."
  },
  {
    "id": "002-byok-fallback",
    "title": "Bring Your Own Key (BYOK) Fallback",
    "feature": "carousel-generator",
    "status": "concluido",
    "desc": "Suporte a chave OpenAI própria do usuário no cliente quando a cota do servidor estiver zerada."
  },
  {
    "id": "003-postiz-backend-tests",
    "title": "Testes Unitários Automatizados no Backend",
    "feature": "postiz-backend-api",
    "status": "concluido",
    "desc": "Criação de 11 testes unitários com Jest cobrindo AuthMiddleware, isolamento multi-tenant e rejeição de tokens maliciosos."
  },
  {
    "id": "004-polotno-postiz-bridge",
    "title": "MCP Bridge: Polotno ➔ Postiz",
    "feature": "polotno-mcp-server",
    "status": "concluido",
    "desc": "Ferramenta MCP export_to_postiz que permite upload direto de artes renderizadas no Polotno para a biblioteca do Postiz."
  },
  {
    "id": "005-carousel-postiz-bridge",
    "title": "Ponte Direta Carousel Generator ➔ Postiz",
    "feature": "carousel-generator",
    "status": "concluido",
    "desc": "Exportação 1-clique de carrosséis PDF/PNG gerados com IA direto para a biblioteca de mídia do Postiz via Server Action proxy multipart."
  },
  {
    "id": "006-polotno-web-canvas",
    "title": "Editor Polotno Canvas Embutido no Postiz Web",
    "feature": "postiz-frontend-web",
    "status": "concluido",
    "desc": "Presets sociais (1:1, 16:9, 9:16, 4:5), carregamento de imagem pré-existente e botão de retoque nas miniaturas sem bloqueio por tier de IA (GAP-MOD-01)."
  },
  {
    "id": "007-ai-copywriter",
    "title": "AI Copywriter & Sugestão de Legendas",
    "feature": "postiz-frontend-web",
    "status": "concluido",
    "desc": "Assistente de copywriting no editor de posts com otimização por rede (LinkedIn, X, Instagram, etc.), 3 ganchos alternativos e nuvem de hashtags com fallback resiliente."
  },
  {
    "id": "008-modular-prisma-schema",
    "title": "Modularização do Schema Prisma (GAP-MOD-02)",
    "feature": "postiz-backend-api",
    "status": "concluido",
    "desc": "Decomposição do schema monolítico de 1.841 linhas em 8 sub-esquemas modulares por domínio, com ativação de prismaSchemaFolder e script de bundle automatizado."
  }
],
  sealSvg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 800\" width=\"800\" height=\"800\">\n  <defs>\n    <radialGradient id=\"sealBgGrad\" cx=\"50%\" cy=\"50%\" r=\"50%\">\n      <stop offset=\"0%\" stop-color=\"#0f172a\" />\n      <stop offset=\"60%\" stop-color=\"#090d16\" />\n      <stop offset=\"100%\" stop-color=\"#030712\" />\n    </radialGradient>\n    <linearGradient id=\"neonCyanViolet\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#06b6d4\" />\n      <stop offset=\"50%\" stop-color=\"#8b5cf6\" />\n      <stop offset=\"100%\" stop-color=\"#3b82f6\" />\n    </linearGradient>\n    <linearGradient id=\"goldGlow\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#fbbf24\" />\n      <stop offset=\"100%\" stop-color=\"#d97706\" />\n    </linearGradient>\n    <filter id=\"sealGlow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\">\n      <feGaussianBlur stdDeviation=\"4\" result=\"blur\" />\n      <feComposite in=\"SourceGraphic\" in2=\"blur\" operator=\"over\" />\n    </filter>\n  </defs>\n\n  <!-- Background Base Disc -->\n  <circle cx=\"400\" cy=\"400\" r=\"380\" fill=\"url(#sealBgGrad)\" stroke=\"#1e293b\" stroke-width=\"3\" />\n  <circle cx=\"400\" cy=\"400\" r=\"365\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"1.5\" stroke-dasharray=\"6 6\" opacity=\"0.6\" />\n  <line x1=\"745.0\" y1=\"400.0\" x2=\"730.0\" y2=\"400.0\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"739.8\" y1=\"459.9\" x2=\"732.9\" y2=\"458.7\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"724.2\" y1=\"518.0\" x2=\"717.6\" y2=\"515.6\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"698.8\" y1=\"572.5\" x2=\"685.8\" y2=\"565.0\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"664.3\" y1=\"621.8\" x2=\"658.9\" y2=\"617.3\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"621.8\" y1=\"664.3\" x2=\"617.3\" y2=\"658.9\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"572.5\" y1=\"698.8\" x2=\"565.0\" y2=\"685.8\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"518.0\" y1=\"724.2\" x2=\"515.6\" y2=\"717.6\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"459.9\" y1=\"739.8\" x2=\"458.7\" y2=\"732.9\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"400.0\" y1=\"745.0\" x2=\"400.0\" y2=\"730.0\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"340.1\" y1=\"739.8\" x2=\"341.3\" y2=\"732.9\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"282.0\" y1=\"724.2\" x2=\"284.4\" y2=\"717.6\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"227.5\" y1=\"698.8\" x2=\"235.0\" y2=\"685.8\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"178.2\" y1=\"664.3\" x2=\"182.7\" y2=\"658.9\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"135.7\" y1=\"621.8\" x2=\"141.1\" y2=\"617.3\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"101.2\" y1=\"572.5\" x2=\"114.2\" y2=\"565.0\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"75.8\" y1=\"518.0\" x2=\"82.4\" y2=\"515.6\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"60.2\" y1=\"459.9\" x2=\"67.1\" y2=\"458.7\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"55.0\" y1=\"400.0\" x2=\"70.0\" y2=\"400.0\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"60.2\" y1=\"340.1\" x2=\"67.1\" y2=\"341.3\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"75.8\" y1=\"282.0\" x2=\"82.4\" y2=\"284.4\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"101.2\" y1=\"227.5\" x2=\"114.2\" y2=\"235.0\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"135.7\" y1=\"178.2\" x2=\"141.1\" y2=\"182.7\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"178.2\" y1=\"135.7\" x2=\"182.7\" y2=\"141.1\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"227.5\" y1=\"101.2\" x2=\"235.0\" y2=\"114.2\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"282.0\" y1=\"75.8\" x2=\"284.4\" y2=\"82.4\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"340.1\" y1=\"60.2\" x2=\"341.3\" y2=\"67.1\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"400.0\" y1=\"55.0\" x2=\"400.0\" y2=\"70.0\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"459.9\" y1=\"60.2\" x2=\"458.7\" y2=\"67.1\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"518.0\" y1=\"75.8\" x2=\"515.6\" y2=\"82.4\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"572.5\" y1=\"101.2\" x2=\"565.0\" y2=\"114.2\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"621.8\" y1=\"135.7\" x2=\"617.3\" y2=\"141.1\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"664.3\" y1=\"178.2\" x2=\"658.9\" y2=\"182.7\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"698.8\" y1=\"227.5\" x2=\"685.8\" y2=\"235.0\" stroke=\"#64748b\" stroke-width=\"2\" opacity=\"0.7\" />\n<line x1=\"724.2\" y1=\"282.0\" x2=\"717.6\" y2=\"284.4\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<line x1=\"739.8\" y1=\"340.1\" x2=\"732.9\" y2=\"341.3\" stroke=\"#64748b\" stroke-width=\"1\" opacity=\"0.7\" />\n<circle cx=\"400\" cy=\"400\" r=\"310\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"1.5\" stroke-dasharray=\"12 6\" opacity=\"0.35\" />\n<circle cx=\"400\" cy=\"400\" r=\"270\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"1.5\"  opacity=\"0.43\" />\n<circle cx=\"400\" cy=\"400\" r=\"230\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"1.5\"  opacity=\"0.51\" />\n<circle cx=\"400\" cy=\"400\" r=\"190\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"3\" stroke-dasharray=\"24 12\" opacity=\"0.59\" />\n<circle cx=\"400\" cy=\"400\" r=\"150\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"1.5\"  opacity=\"0.67\" />\n<circle cx=\"400\" cy=\"400\" r=\"110\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"1.5\"  opacity=\"0.75\" />\n<circle cx=\"400\" cy=\"400\" r=\"70\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"1.5\" stroke-dasharray=\"36 18\" opacity=\"0.83\" />\n<ellipse cx=\"400\" cy=\"400\" rx=\"280\" ry=\"110\" fill=\"none\" stroke=\"#06b6d4\" stroke-width=\"2\" opacity=\"0.65\" transform=\"rotate(0 400 400)\" filter=\"url(#sealGlow)\" />\n<ellipse cx=\"400\" cy=\"400\" rx=\"280\" ry=\"110\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"2\" opacity=\"0.65\" transform=\"rotate(60 400 400)\" filter=\"url(#sealGlow)\" />\n<ellipse cx=\"400\" cy=\"400\" rx=\"280\" ry=\"110\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"2\" opacity=\"0.65\" transform=\"rotate(120 400 400)\" filter=\"url(#sealGlow)\" />\n<polygon points=\"400,260 540,400 400,540 260,400\" fill=\"none\" stroke=\"url(#goldGlow)\" stroke-width=\"2.5\" opacity=\"0.8\" />\n<polygon points=\"400,310 490,400 400,490 310,400\" fill=\"#1e1b4b\" fill-opacity=\"0.5\" stroke=\"#06b6d4\" stroke-width=\"1.5\" transform=\"rotate(45 400 400)\" />\n<circle cx=\"400\" cy=\"400\" r=\"24\" fill=\"url(#neonCyanViolet)\" filter=\"url(#sealGlow)\" />\n<circle cx=\"400\" cy=\"400\" r=\"12\" fill=\"#ffffff\" />\n<circle cx=\"607.8\" cy=\"520.0\" r=\"6\" fill=\"#06b6d4\" filter=\"url(#sealGlow)\" />\n<circle cx=\"192.2\" cy=\"520.0\" r=\"7\" fill=\"#8b5cf6\" filter=\"url(#sealGlow)\" />\n<circle cx=\"400.0\" cy=\"160.0\" r=\"6\" fill=\"#3b82f6\" filter=\"url(#sealGlow)\" />\n<circle cx=\"400.0\" cy=\"580.0\" r=\"5\" fill=\"#fbbf24\" filter=\"url(#sealGlow)\" />\n<circle cx=\"244.1\" cy=\"310.0\" r=\"5\" fill=\"#10b981\" filter=\"url(#sealGlow)\" />\n</svg>",
  sealMiniSvg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" width=\"64\" height=\"64\">\n  <defs>\n    <radialGradient id=\"sealBgGrad\" cx=\"50%\" cy=\"50%\" r=\"50%\">\n      <stop offset=\"0%\" stop-color=\"#0f172a\" />\n      <stop offset=\"60%\" stop-color=\"#090d16\" />\n      <stop offset=\"100%\" stop-color=\"#030712\" />\n    </radialGradient>\n    <linearGradient id=\"neonCyanViolet\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#06b6d4\" />\n      <stop offset=\"50%\" stop-color=\"#8b5cf6\" />\n      <stop offset=\"100%\" stop-color=\"#3b82f6\" />\n    </linearGradient>\n    <linearGradient id=\"goldGlow\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#fbbf24\" />\n      <stop offset=\"100%\" stop-color=\"#d97706\" />\n    </linearGradient>\n    <filter id=\"sealGlow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\">\n      <feGaussianBlur stdDeviation=\"0.32\" result=\"blur\" />\n      <feComposite in=\"SourceGraphic\" in2=\"blur\" operator=\"over\" />\n    </filter>\n  </defs>\n\n  <!-- Background Base Disc -->\n  <circle cx=\"32\" cy=\"32\" r=\"30.400000000000002\" fill=\"url(#sealBgGrad)\" stroke=\"#1e293b\" stroke-width=\"0.24\" />\n  <circle cx=\"32\" cy=\"32\" r=\"29.2\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"0.12\" stroke-dasharray=\"0.48 0.48\" opacity=\"0.6\" />\n  <line x1=\"59.6\" y1=\"32.0\" x2=\"58.4\" y2=\"32.0\" stroke=\"#64748b\" stroke-width=\"0.16\" opacity=\"0.7\" />\n<line x1=\"55.9\" y1=\"45.8\" x2=\"55.4\" y2=\"45.5\" stroke=\"#64748b\" stroke-width=\"0.08\" opacity=\"0.7\" />\n<line x1=\"45.8\" y1=\"55.9\" x2=\"45.5\" y2=\"55.4\" stroke=\"#64748b\" stroke-width=\"0.08\" opacity=\"0.7\" />\n<line x1=\"32.0\" y1=\"59.6\" x2=\"32.0\" y2=\"58.4\" stroke=\"#64748b\" stroke-width=\"0.16\" opacity=\"0.7\" />\n<line x1=\"18.2\" y1=\"55.9\" x2=\"18.5\" y2=\"55.4\" stroke=\"#64748b\" stroke-width=\"0.08\" opacity=\"0.7\" />\n<line x1=\"8.1\" y1=\"45.8\" x2=\"8.6\" y2=\"45.5\" stroke=\"#64748b\" stroke-width=\"0.08\" opacity=\"0.7\" />\n<line x1=\"4.4\" y1=\"32.0\" x2=\"5.6\" y2=\"32.0\" stroke=\"#64748b\" stroke-width=\"0.16\" opacity=\"0.7\" />\n<line x1=\"8.1\" y1=\"18.2\" x2=\"8.6\" y2=\"18.5\" stroke=\"#64748b\" stroke-width=\"0.08\" opacity=\"0.7\" />\n<line x1=\"18.2\" y1=\"8.1\" x2=\"18.5\" y2=\"8.6\" stroke=\"#64748b\" stroke-width=\"0.08\" opacity=\"0.7\" />\n<line x1=\"32.0\" y1=\"4.4\" x2=\"32.0\" y2=\"5.6\" stroke=\"#64748b\" stroke-width=\"0.16\" opacity=\"0.7\" />\n<line x1=\"45.8\" y1=\"8.1\" x2=\"45.5\" y2=\"8.6\" stroke=\"#64748b\" stroke-width=\"0.08\" opacity=\"0.7\" />\n<line x1=\"55.9\" y1=\"18.2\" x2=\"55.4\" y2=\"18.5\" stroke=\"#64748b\" stroke-width=\"0.08\" opacity=\"0.7\" />\n<circle cx=\"32\" cy=\"32\" r=\"24.8\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"0.12\" stroke-dasharray=\"0.96 0.48\" opacity=\"0.35\" />\n<circle cx=\"32\" cy=\"32\" r=\"21.6\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"0.12\"  opacity=\"0.43\" />\n<circle cx=\"32\" cy=\"32\" r=\"18.400000000000002\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"0.12\"  opacity=\"0.51\" />\n<circle cx=\"32\" cy=\"32\" r=\"15.200000000000001\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"0.24\" stroke-dasharray=\"1.92 0.96\" opacity=\"0.59\" />\n<circle cx=\"32\" cy=\"32\" r=\"12\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"0.12\"  opacity=\"0.67\" />\n<circle cx=\"32\" cy=\"32\" r=\"8.8\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"0.12\"  opacity=\"0.75\" />\n<circle cx=\"32\" cy=\"32\" r=\"5.6000000000000005\" fill=\"none\" stroke=\"url(#neonCyanViolet)\" stroke-width=\"0.12\" stroke-dasharray=\"2.88 1.44\" opacity=\"0.83\" />\n<ellipse cx=\"32\" cy=\"32\" rx=\"22.400000000000002\" ry=\"8.8\" fill=\"none\" stroke=\"#06b6d4\" stroke-width=\"0.16\" opacity=\"0.65\" transform=\"rotate(0 32 32)\" filter=\"url(#sealGlow)\" />\n<ellipse cx=\"32\" cy=\"32\" rx=\"22.400000000000002\" ry=\"8.8\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"0.16\" opacity=\"0.65\" transform=\"rotate(60 32 32)\" filter=\"url(#sealGlow)\" />\n<ellipse cx=\"32\" cy=\"32\" rx=\"22.400000000000002\" ry=\"8.8\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"0.16\" opacity=\"0.65\" transform=\"rotate(120 32 32)\" filter=\"url(#sealGlow)\" />\n<circle cx=\"32\" cy=\"32\" r=\"1.92\" fill=\"url(#neonCyanViolet)\" filter=\"url(#sealGlow)\" />\n<circle cx=\"32\" cy=\"32\" r=\"0.96\" fill=\"#ffffff\" />\n<circle cx=\"48.6\" cy=\"41.6\" r=\"0.48\" fill=\"#06b6d4\" filter=\"url(#sealGlow)\" />\n<circle cx=\"15.4\" cy=\"41.6\" r=\"0.56\" fill=\"#8b5cf6\" filter=\"url(#sealGlow)\" />\n<circle cx=\"32.0\" cy=\"12.8\" r=\"0.48\" fill=\"#3b82f6\" filter=\"url(#sealGlow)\" />\n<circle cx=\"32.0\" cy=\"46.4\" r=\"0.4\" fill=\"#fbbf24\" filter=\"url(#sealGlow)\" />\n<circle cx=\"19.5\" cy=\"24.8\" r=\"0.4\" fill=\"#10b981\" filter=\"url(#sealGlow)\" />\n</svg>"
};
