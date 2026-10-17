# Legacy Impact: Feature 020 - Gestão de Kits de Marca & Presets Visuais

> Identificador: `020-hupflow-brand-kits-presets`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Visão Geral das Alterações

A Feature 020 introduz o subsistema de **Kits de Marca Corporativos (Brand Kits)** e **Presets Visuais** para o HupFlow, permitindo que organizações salvem suas paletas institucionais, tipografia de cabeçalho e corpo, logotipos e identificadores sociais (`@handle`). O sistema se integra nativamente ao Estúdio de Carrosséis 2D (`studio/page.tsx`) e ao exportador de documentos PDF para LinkedIn.

---

## 2. Arquivos Criados ou Modificados

| Arquivo | Natureza | Descrição do Impacto |
|---------|:--------:|----------------------|
| `hupflow/src/lib/brand/types.ts` | Novo | Tipos e contratos estritos (`BrandColors`, `BrandTypography`, `BrandKit`, `BrandKitPreset`). |
| `hupflow/src/lib/brand/presets.ts` | Novo | 5 presets de fábrica canônicos (Minimalist Modern, Cyber Glow, Fintech Trust, Creative Bold, Warm Editorial). |
| `hupflow/src/lib/brand/service.ts` | Novo | Funções de validação de hex, integridade de paleta e conversor para `ColorPalette` do canvas 2D. |
| `hupflow/src/lib/brand/brand-kits.test.ts` | Novo | Bateria unitária de testes cobrindo validação e conversão de paletas. |
| `hupflow/src/lib/db/schema.ts` | Modificado | Inclusão da tabela `brand_kits` com índice composto por `orgId` e `isDefault`. |
| `hupflow/src/app/api/brand-kits/route.ts` | Novo | API RESTful (GET, POST, PUT, DELETE) com isolamento multi-tenant rigoroso. |
| `hupflow/src/app/(dashboard)/studio/page.tsx` | Modificado | Integração dinâmica com os kits da organização e injeção do handle no carrossel. |
| `hupflow/src/app/(dashboard)/settings/brand/page.tsx` | Novo | Painel de controle visual de Brand Kits com clonagem de presets em 1 clique. |
| `hupflow/src/app/(dashboard)/layout.tsx` | Modificado | Atalho "Identidade & Marca" no menu de navegação lateral. |

---

## 3. Compatibilidade Regressiva & Regras de Isolamento

1. **Zero Quebra no Canvas 2D**: O conversor `brandColorsToCanvasPalette` gera o objeto `{ background, primaryText, accentColor }` esperado pelo `renderSlideToCanvas` e `exportCarouselToPdf`, preservando 100% de compatibilidade com os carrosséis existentes.
2. **Fallback Gracioso**: Se uma organização não possuir nenhum kit de marca cadastrado, o estúdio utiliza os valores padrão institucionais sem gerar exceções.
3. **Isolamento Multi-tenant**: Toda consulta e mutação de `brand_kits` é filtrada pelo `orgId` do workspace ativo.
4. **Conformidade Clean-Room**: 100% implementado em TypeScript estrito, sem dependência de bibliotecas pesadas de terceiros ou fontes proprietárias.
