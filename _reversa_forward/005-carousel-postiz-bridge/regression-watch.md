# Regression Watch: Ponte Carousel Generator ➔ Postiz Web

> Feature: `005-carousel-postiz-bridge`  
> Data: `2026-10-15`  

## 1. Itens em Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W010 | `carousel-generator-main/src/app/actions.tsx` | A Server Action `uploadToPostizAction` deve receber `FormData` e encaminhar o arquivo com header `auth` para `/media/upload-simple` | presença | Remoção de `uploadToPostizAction` ou omissão do cabeçalho `auth` na requisição |
| W011 | `carousel-generator-main/src/components/editor-menubar.tsx` | O componente `PostizExportDialog` deve estar acessível na barra de menu e no atalho superior com opções PDF e PNG | presença | Remoção de `PostizExportDialog` ou quebra na renderização de slides para canvas |

## 2. Observações

- O upload depende de um token JWT válido e do Postiz Backend em execução (padrão porta 3000).
- Os valores de conexão são persistidos localmente no navegador via `localStorage`.

## 3. Histórico de re-extrações

*(Vazio. Será preenchido nas próximas execuções de `/reversa` sobre o repositório)*

## 4. Arquivadas

*(Nenhum item arquivado)*
