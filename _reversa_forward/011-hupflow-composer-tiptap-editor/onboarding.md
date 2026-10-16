# Guia de Onboarding & Verificação Manual: Editor TipTap & Preview

> Feature: `011-hupflow-composer-tiptap-editor`  
> Data: `2026-10-15`  

---

## 1. Objetivo do Teste

Testar a redação com a barra de ferramentas de formatação do TipTap (negrito, itálico, listas e citações), verificar a alternância das abas de preview nativo (LinkedIn, X, Instagram, Threads) e a anexação de mídias/carrosséis.

---

## 2. Passo a Passo

1. **Acessar o Compositor:**
   - Navegue até `http://localhost:3000/composer`.
   - Observe a nova barra de ferramentas visual do editor com botões de formatação (B, I, Listas, Citação e Emojis).

2. **Testar Formatação Rich-Text:**
   - Selecione uma palavra ou frase do texto.
   - Clique no botão **B (Negrito)** ou use o atalho `Ctrl+B`.
   - Verifique se a palavra é destacada em negrito no texto.
   - Clique no botão de **Lista com Marcadores** e verifique a inserção de bullets formatados.

3. **Testar Mockups de Preview Nativo:**
   - No painel superior, clique no botão **"Ver Preview Fiel"**.
   - Alterne entre as abas:
     - **LinkedIn:** Veja o card oficial com perfil, quebras de texto e botões de reação.
     - **X / Twitter:** Veja o mockup do tweet com contador estrito de 280 caracteres.
     - **Instagram:** Veja o visual do feed com coração e chamada visual.
     - **Threads:** Veja o layout conversacional.

4. **Testar Seletor Rápido de Emojis:**
   - Clique no botão de emoji (😀) na toolbar.
   - Selecione um emoji (ex: ✨, 🚀, 💡).
   - Verifique se o emoji é inserido exatamente onde o cursor estava.

5. **Testar Agendamento Final:**
   - Clique em **"Agendar com BullMQ"** e confirme a mensagem de sucesso.
