# Guia de Teste e Onboarding: Ponte Carousel Generator ➔ Postiz Web

> Feature: `005-carousel-postiz-bridge`  
> Data: `2026-10-15`  

Este guia descreve o procedimento de validação manual de ponta a ponta da integração entre o **Carousel Generator** e o **Postiz Web**.

---

## 1. Pré-requisitos

1. **Postiz Backend** em execução (porta padrão `http://localhost:3000`).
2. **Carousel Generator** em execução (porta padrão `http://localhost:3001` ou similar).
3. Uma conta de usuário ativa no Postiz com uma organização criada.

---

## 2. Como Obter o Token de Acesso do Postiz

1. Abra o **Postiz Web** no navegador (`http://localhost:4200` ou `http://localhost:3000`).
2. Faça login na sua conta.
3. Abra as Ferramentas do Desenvolvedor (**F12**) ➔ aba **Application** (ou Armazenamento) ➔ **Cookies**.
4. Copie o valor do cookie `auth` (ou obtenha via cabeçalho `auth` na aba **Network** em qualquer requisição autenticada).

---

## 3. Passo a Passo de Execução

1. Acesse o **Carousel Generator** no seu navegador.
2. Crie ou gere um carrossel de slides (via IA ou utilizando o conteúdo padrão de exemplo).
3. Na barra de navegação superior, clique no menu **File** ➔ **Enviar para o Postiz**.
4. No diálogo modal que se abrirá:
   - Verifique a **API URL do Postiz** (padrão: `http://localhost:3000`).
   - Cole o seu **Token do Postiz** no campo correspondente.
   - Selecione o **Formato de Envio**:
     - *Documento PDF* (para LinkedIn)
     - *Imagens PNG* (para Instagram / redes visuais)
5. Clique no botão **Confirmar e Enviar**.
6. Aguarde o processamento:
   - O indicador de carregamento exibirá o status da renderização e do upload.
7. Ao concluir, um **Toast de Sucesso** será exibido na tela com a mensagem de confirmação e um botão **Criar Post no Postiz**.
8. Clique no botão do Toast ou acesse a biblioteca de mídias do Postiz para constatar o novo arquivo salvo na organização!
