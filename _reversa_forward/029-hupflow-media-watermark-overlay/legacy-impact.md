# Análise de Impacto no Sistema: Marca d'Água (Watermark Overlay) & Selos Corporativos

> Identificador da Feature: `029-hupflow-media-watermark-overlay`  
> Data: `2026-10-16`  
> Responsável: Equipe de Governança Reversa  

---

## 1. Escopo de Impacto

A Feature 029 introduziu o subsistema de **Marca d'Água (Watermark Overlay) & Selos Corporativos Automáticos** do HupFlow:
- Motor geométrico puro `calculateWatermarkCoordinates` para cálculo de posições (5 quadrantes: `bottom_right`, `bottom_left`, `top_right`, `top_left`, `center`), escala proporcional e margens sem distorção.
- Suporte a 3 modalidades de selo: Logotipo (`logo`), `@handle` (`text`) ou Combinado (`combined`).
- Tabela `watermark_settings` no Drizzle ORM com isolamento multi-tenant por organização (`organization_id`).
- Integração nativa com o Brand Kit do workspace (recuperação automática de logotipo e handle corporativo).
- Componente `WatermarkPreviewCard.tsx` com simulação interativa de formatos 1:1 (Feed) e 9:16 (Stories/Reels).
- Painel de controle em `/settings/watermark` com seletores interativos, sliders em tempo real e atalho no menu lateral (`layout.tsx`).

O impacto é **100% aditivo e seguro**:
- Adição da tabela `watermark_settings` sem quebrar esquemas existentes.
- Cálculos puramente não-destrutivos, preservando mídias originais intactas no storage R2/S3.
- Rota REST `/api/watermark` protegida com controle de acesso RBAC.

---

## 2. Matriz de Componentes Afetados

| Componente | Tipo de Modificação | Risco | Mitigação Aplicada |
|------------|---------------------|:-----:|-------------------|
| `hupflow/src/lib/db/schema.ts` | Adição da tabela `watermark_settings` | Baixo | Chave estrangeira com exclusão em cascata vinculada a `organizations`. |
| `hupflow/src/lib/watermark/types.ts` | Novo arquivo de tipos e contratos | Mínimo | TypeScript estrito com tipos literais para posições e modalidades. |
| `hupflow/src/lib/watermark/service.ts` | Motor de cálculo geométrico e serviço | Baixo | Matemática pura e fallback automático ao Brand Kit. |
| `hupflow/src/lib/watermark/watermark.test.ts` | Bateria de testes unitários | Mínimo | 100% de cobertura nos 5 quadrantes e clamping anti-overflow. |
| `hupflow/src/app/api/watermark/route.ts` | Nova rota REST (GET, POST) | Baixo | RBAC `viewer` para leitura e `member` para escrita. |
| `hupflow/src/components/watermark/WatermarkPreviewCard.tsx` | Novo componente de preview | Mínimo | Simulação CSS pura em 1:1 e 9:16 sem dependência externa. |
| `hupflow/src/app/(dashboard)/settings/watermark/page.tsx` | Novo painel administrativo | Mínimo | Interface de gerenciamento isolada com sliders reativos. |
| `hupflow/src/app/(dashboard)/layout.tsx` | Inclusão de atalho no menu | Mínimo | Adição do item "Marca d'Água" com ícone `Stamp`. |
