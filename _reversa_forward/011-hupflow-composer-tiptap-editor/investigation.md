# Investigação Técnica: TipTap Rich-Text & Mockups Nativos de Redes

> Feature: `011-hupflow-composer-tiptap-editor`  
> Data: `2026-10-15`  

---

## 1. Contexto e Benefícios do TipTap no Next.js 15

O TipTap é um editor headless baseado no ProseMirror (Licença MIT). Diferente de editores tradicionais com iframes (TinyMCE, CKEditor), ele renderiza elementos HTML nativos diretamente no DOM do React, permitindo controle absoluto sobre classes do Tailwind CSS e estilos responsivos.

No Next.js 15 App Router:
- Requer a diretiva `'use client'`.
- A inicialização com `useEditor` deve definir `immediatelyRender: false` para evitar warnings de hidratação SSR.
- Suporta extensões leves: `@tiptap/starter-kit`, `@tiptap/extension-placeholder` e `@tiptap/extension-character-count`.

## 2. Anatomia dos Mockups Visuais por Rede Social

Para criar a experiência de "WOW factor", os previews devem replicar a anatomia visual real de cada feed:
1. **LinkedIn:** Card cinza escuro/branco com foto circular do perfil, headline profissional, badge de tempo (`1h • Editado`), quebras de parágrafos confortáveis, visualizador de documento PDF/carrossel deslizável com barra de progresso inferior e botões de `Curtir`, `Comentar`, `Compartilhar` e `Enviar`.
2. **X (Twitter):** Card minimalista com avatar, `@handle`, texto incisivo com quebra de 280 chars, tags em azul e métricas simuladas (retweets, curtidas, bookmarks).
3. **Instagram:** Layout vertical com cabeçalho de perfil, imagem ou carrossel com navegação por pontos indicadores (dots), botões de coração/balão/salvar, e texto da legenda com destaque para o nome do autor em negrito.
4. **Threads:** Design moderno e focado em conversa, avatar com linha conectora vertical sutil e botões de repost e resposta.
