# Data Delta: 041-hupflow-social-commerce-product-catalog

## Nova Tabela Drizzle ORM (`hupflow/src/lib/db/schema.ts`)

### `socialCommerceProducts` (`social_commerce_products`)
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `text` | `PRIMARY KEY` | Identificador único (`prd_<uuid>`) |
| `organizationId` | `text` | `NOT NULL, FK -> organizations.id ON DELETE CASCADE` | Isolamento multi-tenant |
| `sku` | `text` | `NOT NULL` | Código SKU ou identificador da oferta |
| `name` | `text` | `NOT NULL` | Nome comercial do produto / plano / infoproduto |
| `category` | `text` | `NOT NULL, DEFAULT 'saas_plan'` | Categoria (`saas_plan`, `digital_course`, `physical_product`, `consulting_service`) |
| `channel` | `text` | `NOT NULL, DEFAULT 'instagram'` | Canal primário de Social Commerce (`instagram`, `tiktok`, `youtube`, `linkedin`) |
| `priceBrl` | `integer` | `NOT NULL, DEFAULT 297` | Preço unitário em BRL |
| `checkoutUrl` | `text` | `NOT NULL` | URL de checkout com rastreamento |
| `taggedPostsCount` | `integer` | `NOT NULL, DEFAULT 1` | Quantidade de posts/Reels com tag deste produto |
| `taggedImpressions` | `integer` | `NOT NULL, DEFAULT 10000` | Impressões acumuladas nos posts com tag |
| `productClicks` | `integer` | `NOT NULL, DEFAULT 350` | Cliques na tag de produto / link de compra |
| `ordersCount` | `integer` | `NOT NULL, DEFAULT 15` | Pedidos pagos atribuídos |
| `isActive` | `boolean` | `NOT NULL, DEFAULT true` | Produto ativo na vitrine social |
| `createdAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de criação |
| `updatedAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de atualização |
