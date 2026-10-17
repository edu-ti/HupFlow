# Regression Watch: Feature 020 - Gestão de Kits de Marca & Presets Visuais

> Identificador: `020-hupflow-brand-kits-presets`  
> Data: `2026-10-16`  
> Status: Ativo  

---

## 1. Itens de Monitoramento

| ID | Área / Componente | Condição Crítica | Risco Mitigado |
|----|-------------------|------------------|----------------|
| **W029** | `src/lib/brand/service.ts` | Validação de cores hexadecimais com regex `^#([0-9A-Fa-f]{3}\|[0-9A-Fa-f]{6})$` | Prevenir injeção de valores inválidos de cores no contexto 2D do Canvas |
| **W030** | `src/app/api/brand-kits/route.ts` | Garantia de unicidade de `isDefault: true` por `orgId` | Evitar múltiplos kits padrão simultâneos para a mesma organização |
| **W031** | `src/app/(dashboard)/studio/page.tsx` | Fallback de paleta e handle caso `GET /api/brand-kits` retorne vazio | Impedir que falhas de rede no carregamento de kits quebrem a renderização dos slides |

---

## 2. Estratégia de Verificação

1. **Testes Unitários**: Execução do script `src/lib/brand/brand-kits.test.ts`.
2. **Checagem Estática**: Compilação TypeScript com `npx tsc --noEmit`.
3. **Verificação de Regressão Cruzada**: Garantir que a geração de carrosséis por IA (`/api/ai/carousel`) e o agendamento em massa (`/api/ai/bulk-campaign`) permaneçam 100% operacionais.
