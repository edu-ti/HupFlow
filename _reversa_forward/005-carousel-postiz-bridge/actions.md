# Actions: Ponte Carousel Generator ➔ Postiz Web

> Identificador: `005-carousel-postiz-bridge`  
> Data: `2026-10-15`  
> Roadmap: `_reversa_forward/005-carousel-postiz-bridge/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 5 |
| Paralelizáveis (`[//]`) | 1 |
| Maior cadeia de dependência | 4 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Definir as tipagens de contrato `UploadToPostizResult` e interfaces de payload em `actions.tsx` | - | `[//]` | `carousel-generator-main/src/app/actions.tsx` | 🟢 | `[X]` |

## Fase 2, Testes

<!-- Verificação via checagem estática TypeScript e validação de runtime no Next.js. -->

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T002 | Implementar a Server Action `uploadToPostizAction` com proxy multipart HTTP para `POST /media/upload-simple` e tratamento de status 401/403/500 | T001 | - | `carousel-generator-main/src/app/actions.tsx` | 🟢 | `[X]` |
| T003 | Criar o componente modal `PostizExportDialog` com formulário de credenciais, seletor de formato (PDF/PNG) e rotina de renderização de slides em memória | T002 | - | `carousel-generator-main/src/components/postiz-export-dialog.tsx` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Integrar o diálogo `PostizExportDialog` na barra de menu sob a opção "Enviar para o Postiz" em `editor-menubar.tsx` | T003 | - | `carousel-generator-main/src/components/editor-menubar.tsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Adicionar notificações toast amigáveis com botão de deep-link "Criar Post no Postiz" e persistência automática de `apiUrl` e `token` em `localStorage` | T004 | - | `carousel-generator-main/src/components/postiz-export-dialog.tsx` | 🟢 | `[X]` |

## Notas de execução

- Tarefas T001 a T005 concluídas com sucesso sob política de segurança `allowLegacyEdits: true` no escopo `carousel-generator-main/**`.
- Implementada a Server Action `uploadToPostizAction` para ingestão direta no endpoint `/media/upload-simple` do Postiz.
- Criado o diálogo `PostizExportDialog` com suporte a exportação em PDF e PNG, renderização limpa dos slides via `preparePrintClone`, e toasts com atalho direto para criar o post no Postiz Web.
- Integrado tanto no menu `File` de `editor-menubar.tsx` quanto como botão de acesso rápido na barra superior.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-to-do` | reversa |
| 2026-10-15 | Conclusão das tarefas T001 a T005 em `/reversa-coding` | reversa |
