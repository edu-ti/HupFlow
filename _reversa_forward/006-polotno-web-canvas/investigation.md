# Investigação Técnica: Editor Polotno Canvas no Postiz Web

> Feature: `006-polotno-web-canvas`  
> Data: `2026-10-15`  

## 1. Funcionamento do Polotno SDK no Frontend

O componente `Polonto` em `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx` utiliza o SDK `@polotno` na versão `^3.0.0-beta.25`.

### Gerenciamento de Tamanho da Prancheta
No Polotno SDK:
```ts
// Altera a resolução da prancheta mantendo os elementos
store.setSize(width, height);
```
Quando `setSize` é executado, o Polotno recalcula a grade de desenho, atualiza a régua e redimensiona a prancheta ativa sem descartar o histórico de desfazer/refazer.

### 4 Presets Essenciais de Redes Sociais
1. **1:1 Quadrado** (1080 x 1080 px): Padrão de feed do Instagram, Facebook e Threads.
2. **16:9 Paisagem** (1200 x 675 px): Padrão ótimo para Twitter/X, LinkedIn e visualizações de link no Facebook.
3. **9:16 Vertical** (1080 x 1920 px): Formato nativo de Stories, Instagram Reels, TikTok e YouTube Shorts.
4. **4:5 Retrato** (1080 x 1350 px): Formato de máxima ocupação de tela no feed vertical do Instagram.

### Inserção de Mídia Existente
Para carregar uma imagem como base na prancheta ao abrir o modal:
```ts
const page = store.pages[0] || store.addPage({ width, height });
page.addElement({
  type: 'image',
  src: initialMedia.path,
  x: 0,
  y: 0,
  width: page.width,
  height: page.height,
});
```

## 2. Ponto de Integração em `media.component.tsx`

Atualmente, `media.component.tsx` possui a função `designMedia`:
```ts
const designMedia = useCallback(() => {
  if (!!user?.tier?.ai && !dummy) {
    modals.openModal({ ... });
  }
}, [changeMedia, t]);
```
Ao remover o gate `!!user?.tier?.ai`, o modal é disponibilizado para todos os usuários.
Adicionalmente, expandimos a assinatura para aceitar a mídia selecionada e o índice no array:
```ts
designMedia(item?: { id: string; path: string }, replaceIndex?: number)
```
E adicionamos um botão com ícone de edição (lápis/pincel) sobreposto a cada miniatura renderizada dentro de `ReactSortable`.
