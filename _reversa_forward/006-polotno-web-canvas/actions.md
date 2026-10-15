# Actions: Editor Polotno Canvas Embutido no Postiz Web

> Identificador: `006-polotno-web-canvas`  
> Data: `2026-10-15`  
> Roadmap: `_reversa_forward/006-polotno-web-canvas/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 6 |
| Paralelizáveis (`[//]`) | 1 |
| Maior cadeia de dependência | 5 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Definir as estruturas de dados e tipagens para presets sociais (`SOCIAL_PRESETS`) e propriedades expandidas de `Polonto` | - | `[//]` | `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx` | 🟢 | `[X]` |

## Fase 2, Testes

<!-- Verificação via checagem estática de tipagem TypeScript no Next.js. -->

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T002 | Implementar barra de 4 presets sociais rápidos (1:1, 16:9, 9:16, 4:5) no topo do canvas acionando `store.setSize` | T001 | - | `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx` | 🟢 | `[X]` |
| T003 | Adicionar suporte a `initialMedia` no `Polonto` para inicializar a prancheta com imagem existente pré-carregada | T002 | - | `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Desbloquear `designMedia` em `media.component.tsx` (removendo restrição rígida de tier de IA) e gerenciar substituição de mídia no post | T003 | - | `postiz-app-main/apps/frontend/src/components/media/media.component.tsx` | 🟢 | `[X]` |
| T005 | Adicionar botão de atalho com ícone de edição ("Editar Arte") sobre cada miniatura de mídia anexada na lista de uploads | T004 | - | `postiz-app-main/apps/frontend/src/components/media/media.component.tsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T006 | Ajustar estilo visual dos seletores de proporção e indicadores de status no modal | T005 | - | `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx` | 🟢 | `[X]` |

## Notas de execução

- Tarefas T001 a T006 concluídas com sucesso sob política de segurança `allowLegacyEdits: true` no escopo `postiz-app-main/**`.
- Implementados os 4 presets sociais em `polonto.tsx` (1:1 Quadrado, 16:9 Paisagem, 9:16 Stories, 4:5 Retrato) com redimensionamento instantâneo via `store.setSize`.
- Adicionado carregamento de imagem pré-existente via `initialMedia` no Polonto.
- Desbloqueado acesso ao modal `designMedia` para todos os planos e adicionado ícone de retoque "Editar Arte" nas miniaturas de fotos do post editor.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-to-do` | reversa |
| 2026-10-15 | Conclusão das tarefas T001 a T006 em `/reversa-coding` | reversa |
