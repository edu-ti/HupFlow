# Roadmap: Smart Link-in-Bio Multi-Link & Showcase

> Identificador: `031-hupflow-smart-link-in-bio`  
> Data: `2026-10-16`  

---

## Fases de Execução

### Fase 1: Fundação de Dados e Contratos
- Criar tipos em `hupflow/src/lib/bio/types.ts` (`BioProfile`, `BioLink`, `BioTheme`, `BioClickEvent`, `BioSocialLinks`).
- Atualizar Drizzle ORM schema em `hupflow/src/lib/db/schema.ts` com as tabelas:
  - `bio_profiles`: perfil, tema, handle, customizações.
  - `bio_links`: botões individuais com ordenação e estatísticas.
  - `bio_clicks`: registros analíticos agregados e por clique.

### Fase 2: Testes Unitários de Validação
- Criar `hupflow/src/lib/bio/bio.test.ts` validando:
  - Sanitização e validação de `handle` (apenas letras minúsculas, números, hífens e underscores).
  - Cálculo de CTR e ordenação dos links por `sort_order`.
  - Mecanismo de resolução de temas visuais (paletas canônicas: `dark`, `light`, `gradient_violet`, `midnight_gold`, `emerald_minimal`).

### Fase 3: Camada de Negócio e APIs REST
- Implementar `hupflow/src/lib/bio/service.ts`:
  - CRUD de perfil de bio e links associados.
  - Resolução pública de handle para a página `/bio/[handle]`.
  - Ingestão de telemetria de visualizações e cliques.
- Criar rotas de API:
  - `GET /api/bio`: retorna a configuração da bio do workspace ativo.
  - `POST /api/bio`: cria ou atualiza perfil e links do workspace.
  - `GET /api/bio/public/[handle]`: busca pública de perfil para renderização sem auth.
  - `POST /api/bio/click`: registra clique em um botão específico de forma assíncrona.

### Fase 4: Interface de Gerenciamento & Live Preview
- Criar componente de simulador: `hupflow/src/components/bio/BioPhonePreview.tsx`.
- Criar tela de configuração: `hupflow/src/app/(dashboard)/settings/bio/page.tsx`.
  - Abas: Links, Estilo & Temas, Vitrine de Posts e Métricas.
  - Adição rápida de novos links, reordenação (subir/descer) e alternância ativo/destaque.
  - Visualização ao vivo no frame de smartphone ao lado.
- Criar página pública responsiva: `hupflow/src/app/bio/[handle]/page.tsx`.

### Fase 5: Integração, Navegação e Auditoria
- Adicionar link 'Link na Bio' na barra de navegação em `hupflow/src/app/(dashboard)/layout.tsx` com ícone `Smartphone`.
- Validar conformidade de tipos com `npx tsc --noEmit` e rodar testes com `npx tsx src/lib/bio/bio.test.ts`.
- Gerar documentação de impacto legado, watchpoints de regressão (W062, W063, W064) e adendo SDD 031.
