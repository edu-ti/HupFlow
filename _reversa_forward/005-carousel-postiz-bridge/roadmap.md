# Roadmap: Ponte Carousel Generator ➔ Postiz Web

> Identificador: `005-carousel-postiz-bridge`  
> Data: `2026-10-15`  
> Requirements: `_reversa_forward/005-carousel-postiz-bridge/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

## 1. Resumo da abordagem

Esta evolução constrói a integração direta entre o **Carousel Generator** e a plataforma **Postiz Web**, completando o ciclo de criação e publicação do monorepo HupFlow. A abordagem consiste em disponibilizar uma ação "Enviar para Postiz" na barra de menu do Carousel Generator (`editor-menubar.tsx`). Ao ser acionada, um diálogo modal permite ao usuário escolher entre exportar como documento PDF (ideal para LinkedIn) ou lâminas PNG (para Instagram/X), além de configurar a URL e o token do Postiz (salvos no `localStorage`). A renderização é executada no cliente via `html-to-image`/`jsPDF` e encaminhada para uma Server Action segura no Next.js (`uploadToPostizAction`), que repassa o buffer multipart diretamente para o endpoint `POST /media/upload-simple` do Postiz Backend, eliminando problemas de CORS e concluindo com Toast informativo com link para criar o post.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Interoperabilidade de Módulos | Une a geração assistida por IA de carrosséis à esteira de publicação e agendamento multicanal do Postiz. | respeita |
| Isolamento Multi-tenant | Respeita a fronteira da organização ativa via token `auth` injetado em cada upload. | respeita |
| Segurança & Resiliência | Evita exposição de requisições sensíveis no cliente delegando o tráfego HTTP para Server Actions com CORS isolado. | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Utilizar Server Action Next.js (`uploadToPostizAction`) como proxy backend | Elimina restrições de CORS entre portas diferentes no monorepo e padroniza tratamento de erros de rede | `fetch` client-side direto do navegador | 🟢 |
| D-02 | Suporte dual de formatos (PDF e pacote de PNGs) com seletor no modal | Atende simultaneamente publicações de documentos no LinkedIn e carrosséis visuais no Instagram/X | Forçar apenas PDF ou apenas imagens | 🟢 |
| D-03 | Armazenamento de credenciais (`apiUrl` e `token`) em `localStorage` no browser | Evita redigitação a cada exportação sem exigir banco de dados adicional no Carousel Generator | Variáveis de ambiente fixas ou solicitar token em cada upload | 🟢 |
| D-04 | Reuso estrito do endpoint `/media/upload-simple` do Postiz Backend | O endpoint já valida sessão, faz parsing multipart e persiste a mídia na organização do usuário | Criar novo controlador de ingestão customizado no Postiz | 🟢 |
| D-05 | Notificação Toast com botão de atalho "Criar Post no Postiz" | Fecha a jornada do usuário fornecendo deep-link imediato para o editor de publicações | Mensagem de log silenciosa ou download local redundante | 🟢 |

## 4. Premissas

Todas as dúvidas levantadas na fase de requisitos foram 100% resolvidas durante a sessão de esclarecimentos (`/reversa-clarify`). Nenhuma premissa não confirmada permanece em aberto.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `ServerActions` | `carousel-generator-main/src/app/actions.tsx` | contrato-novo | Adiciona a Server Action `uploadToPostizAction` para proxy multipart. |
| `EditorMenubar` | `carousel-generator-main/src/components/editor-menubar.tsx` | regra-alterada | Adiciona o item de menu "Enviar para Postiz" com ícone de integração. |
| `PostizExportDialog` | `carousel-generator-main/src/components/postiz-export-dialog.tsx` | componente-novo | Diálogo modal com seletor de formato, campos de conexão e feedback de status. |

## 6. Delta no modelo de dados

- Resumo das mudanças: Nenhuma modificação no schema Prisma; utiliza o modelo existente de `Media` do Postiz.
- Detalhe completo em: `_reversa_forward/005-carousel-postiz-bridge/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| `POST /media/upload-simple` | HTTP REST Multipart | `_reversa_forward/005-carousel-postiz-bridge/interfaces/postiz-media-upload.md` |

## 8. Plano de migração

Não aplicável (sem alterações de esquema de banco de dados).

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Postiz Backend offline ou porta local diferente | Médio | Média | Campo `apiUrl` editável no modal com validação de status e mensagem explicativa de erro. |
| Token de autenticação expirado ou inválido | Baixo | Média | Captura de HTTP 401/403 com toast orientando a atualização do token nas configurações. |
| Carrossel com grande quantidade de lâminas causando payload pesado | Médio | Baixa | Compressão de qualidade de imagem no canvas e envio em streaming pelo FormData. |

## 10. Critério de pronto

- [ ] Todas as ações de `actions.md` concluídas com status `[X]`
- [ ] Server Action `uploadToPostizAction` implementada e testada
- [ ] Componente `PostizExportDialog` funcional e integrado ao menu
- [ ] Upload bem-sucedido de carrossel PDF e verificação na biblioteca de mídia do Postiz
- [ ] Notificação toast com link funcional para o Postiz Web

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-plan` | reversa |
