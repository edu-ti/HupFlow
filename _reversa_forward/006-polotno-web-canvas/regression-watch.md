# Regression Watch: Editor Polotno Canvas Embutido no Postiz Web

> Feature: `006-polotno-web-canvas`  
> Data: `2026-10-15`  

## 1. Itens em Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W012 | `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx` | O componente `Polonto` deve renderizar a barra de presets sociais (1:1, 16:9, 9:16, 4:5) e redimensionar a prancheta via `store.setSize` | presença | Remoção de `SOCIAL_PRESETS` ou quebra no redimensionamento da prancheta |
| W013 | `postiz-app-main/apps/frontend/src/components/media/media.component.tsx` | O método `designMedia` deve permanecer acessível para todos os planos e conter botão de retoque nas miniaturas de fotos | presença | Reintrodução do bloqueio rígido `user?.tier?.ai` ou remoção do botão de edição nas miniaturas |

## 2. Observações

- A geração de imagem por inteligência artificial continua restrita aos tiers com créditos de IA configurados.

## 3. Histórico de re-extrações

*(Vazio. Será preenchido nas próximas execuções de `/reversa` sobre o repositório)*

## 4. Arquivadas

*(Nenhum item arquivado)*
