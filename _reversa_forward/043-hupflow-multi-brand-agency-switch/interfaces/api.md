# Interfaces de API — Feature 043: Seletor Rápido & Workspace Switcher de Agência Multi-Marca

## 1. Endpoints de Marcas da Agência (`/api/agency/brands`)
- **`GET /api/agency/brands`**:
  - Retorna todas as marcas associadas à agência/operador com metadados de saúde, filtros de busca e contadores.
  - Query params opcionais: `?q=query&niche=niche&favoritesOnly=true`
  - Resposta: `{ success: true, brands: AgencyBrandProfile[], summary: AgencyPortfolioSummary }`

- **`POST /api/agency/brands`**:
  - Cria um novo perfil de marca cliente.
  - Body: `{ brandName, slug, niche, colorHex, tier, monthlyPostQuota, tags }`

- **`PATCH /api/agency/brands`**:
  - Atualiza status, favoritismo (`isFavorite`), nicho ou cor da marca.
  - Body: `{ id, isFavorite?, status?, colorHex?, tier? }`

- **`DELETE /api/agency/brands?id=:id`**:
  - Remove ou arquiva o perfil da marca da carteira da agência.

## 2. Endpoint de Alternância de Contexto (`/api/agency/switch`)
- **`POST /api/agency/switch`**:
  - Alterna atulmente o tenant ativo para o ID da marca cliente selecionada.
  - Body: `{ targetOrganizationId: string }`
  - Resposta: `{ success: true, activeOrganizationId: string, brandName: string }`
  - Define o cookie de contexto `hupflow_org_context` ou equivalente de sessão.
