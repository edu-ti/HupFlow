# Guia de Onboarding & Verificação Manual: Estúdio de Carrosséis

> Feature: `009-hupflow-studio-carousel`  
> Data: `2026-10-15`  

---

## 1. Objetivo do Teste

Validar a criação interativa de um carrossel educativo no HupFlow Studio, a alternância de proporções, a geração via IA e a exportação em PNG individual e em PDF multi-páginas compatível com LinkedIn.

---

## 2. Passo a Passo

1. **Acessar o Estúdio:**
   - Navegue até `http://localhost:3000/studio` no navegador.
   - Verifique se a prancheta escura com a paleta *Midnight Indigo* é exibida com o Slide 1 ativo.

2. **Testar Alternância de Aspect Ratio:**
   - Clique em **"1:1 Quadrado"** e observe o formato quadrado (1080x1080).
   - Clique em **"4:5 Retrato"** e verifique se a prancheta se expande verticalmente (1080x1350).

3. **Testar Navegação de Slides:**
   - Clique na seta direita `>` e navegue até o Slide 2, 3, 4 e 5.
   - Observe a mudança do indicador superior: `SLIDE 3 / 5`.

4. **Editar Conteúdo em Tempo Real:**
   - No painel lateral direito, altere o campo **Título / Headline** para `"Meu Novo Título de Teste"`.
   - Observe a atualização imediata no canvas gráfico.

5. **Gerar com IA:**
   - No banner superior, digite um novo tema: `"Como Aprender TypeScript em 2026"`.
   - Clique em **"Criar com IA"**.
   - Verifique se os slides são substituídos pelos novos tópicos gerados.

6. **Exportar Arquivos:**
   - Clique em **"Baixar Slide (PNG)"** e confirme o download do arquivo de imagem do slide atual.
   - Clique em **"Baixar Carrossel (PDF)"** e abra o PDF baixado no leitor do navegador, verificando se cada slide ocupa exatamente uma página com alta nitidez.
