# Impacto no Legado: Editor Polotno Canvas Embutido no Postiz Web

> Feature: `006-polotno-web-canvas`  
> Data de Execução: `2026-10-15`  
> Política de Edição Ativa: `allowLegacyEdits: true`  
> Escopo Liberado em `allowedPaths`: `["carousel-generator-main/**", "postiz-app-main/**", "polotno-studio-app-master/**"]`  

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx` | `postiz-frontend-web` | `regra-alterada` | MEDIUM | Adiciona barra de 4 presets sociais de resolução e suporte a `initialMedia` |
| `postiz-app-main/apps/frontend/src/components/media/media.component.tsx` | `postiz-frontend-web` | `regra-alterada` | MEDIUM | Desbloqueia `designMedia` para todos os planos e adiciona atalho "Editar Arte" |

## 2. Diff Conceitual por Componente

### Componente: `postiz-frontend-web`
- **Antes**: O componente `Polonto` iniciava sempre com uma prancheta em branco de dimensões fixas (540x675) e o botão "Design Media" era bloqueado exclusivamente para usuários que possuíam o plano `user?.tier?.ai`. Mídias existentes anexadas ao post não podiam ser editadas no canvas.
- **Depois**: O editor Polonto passa a disponibilizar 4 presets rápidos (1:1, 16:9, 9:16 e 4:5) que redimensionam a prancheta em tempo real. O acesso é liberado para todos os usuários comporem designs, e cada imagem anexada ao post ganha o botão "Editar Arte", permitindo retocar fotos diretamente no canvas e substituir o anexo no post mantendo a versão original na biblioteca.

## 3. Regras Preservadas

- **Upload Multipart (`/media/upload-simple`)**: O fluxo de exportação para Blob PNG e persistência no banco de dados do Postiz permanece idêntico.
- **Isolamento Multi-tenant (`RN-01`)**: As imagens continuam pertencendo estritamente à organização ativa do usuário logado.

## 4. Regras Modificadas

- **RN-CANVAS-01**: Presets de Proporção Social em Tempo Real (1:1, 16:9, 9:16, 4:5).
- **RN-CANVAS-02**: Retoque com Substituição Contextual no Post.
- **RN-CANVAS-03**: Democratização do Acesso ao Editor de Layout Visual (desbloqueio do gate `user?.tier?.ai`).
