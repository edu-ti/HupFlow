# Guia de Teste e Onboarding: Editor Polotno Canvas no Postiz Web

> Feature: `006-polotno-web-canvas`  
> Data: `2026-10-15`  

Este guia descreve como validar as melhorias do editor gráfico integrado no **Postiz Web**.

---

## 1. Pré-requisitos

1. **Postiz Backend** (`http://localhost:3000`) e **Postiz Frontend** (`http://localhost:4200`) em execução.
2. Uma conta logada no Postiz.

---

## 2. Teste de Criação com Presets de Redes Sociais

1. No Postiz Web, acesse a criação de posts (botão **Novo Post** ou calendário).
2. Na área de anexos e mídias, localize e clique no botão **Design Media**.
3. Observe que o modal abre com a barra de ferramentas superior contendo os 4 presets rápidos:
   - `1:1 (Quadrado)`
   - `16:9 (Paisagem)`
   - `9:16 (Stories/Reels)`
   - `4:5 (Retrato)`
4. Alterne entre os presets e observe o canvas ajustando sua proporção instantaneamente.
5. Adicione um elemento de texto ou vetor pelo menu lateral.
6. Clique no botão **Use this media**.
7. Verifique que o criativo foi renderizado e adicionado à lista de mídias do post.

---

## 3. Teste de Retoque de Mídia Existente

1. Faça upload de uma foto qualquer no formulário do post.
2. Na lista de miniaturas anexadas, passe o cursor sobre a imagem e clique no ícone de **Editar Arte** (lápis).
3. Verifique que o modal do Polotno é aberto com a imagem original já posicionada na prancheta.
4. Adicione um filtro, texto ou forma sobre a foto.
5. Clique em **Use this media**.
6. Constatar que a imagem retocada substituiu a versão anterior no post, com ambas salvas na biblioteca da organização.
