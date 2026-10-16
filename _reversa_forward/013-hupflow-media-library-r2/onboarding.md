# Guia de Onboarding & Verificação Manual: Biblioteca de Mídias & Upload R2

> Feature: `013-hupflow-media-library-r2`  
> Data: `2026-10-15`  

---

## 1. Objetivo do Teste

Validar a interface da Biblioteca de Mídias em `/media`, testar a funcionalidade de drag-and-drop de arquivos no modal de upload, verificar a validação de formato e tamanho, checar a barra de progresso e visualizar os arquivos carregados com suas dimensões e metadados na galeria.

---

## 2. Passo a Passo

1. **Acessar a Biblioteca de Mídias:**
   - Navegue até `http://localhost:3000/media` (ou clique em **"Biblioteca de Mídias"** na barra lateral de navegação).
   - Observe a galeria com os filtros de topo: `Todas as Mídias`, `Imagens`, `Vídeos` e `Documentos / PDFs`.

2. **Abrir o Modal de Upload:**
   - Clique no botão de destaque **"Fazer Upload de Mídia"** (`+`).
   - Observe a zona de arrastar e soltar (Dropzone) com avisos claros sobre limites (25MB para imagens/PDFs e 100MB para vídeos).

3. **Testar Validação de Arquivo Inválido:**
   - Tente selecionar um arquivo com extensão não permitida (ex: `.zip` ou `.exe`).
   - Observe a rejeição imediata com aviso informativo em vermelho na interface, sem requisição ao servidor.

4. **Realizar Upload Válido:**
   - Arraste ou selecione uma imagem válida (PNG/JPEG/WEBP) ou PDF de carrossel.
   - Veja o progresso percentual fluido do upload.
   - Ao finalizar, o modal fecha automaticamente ou exibe feedback de sucesso, e a nova mídia aparece imediatamente no topo da grade da galeria.

5. **Copiar URL & Gerenciar Mídia:**
   - Passe o cursor sobre o card da mídia recém-adicionada.
   - Clique em **"Copiar URL"** para copiar o link público para a área de transferência.
