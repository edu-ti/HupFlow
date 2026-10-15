# Requirements: Ponte Polotno Studio (MCP) ➔ Postiz Web

> Identificador: `004-polotno-postiz-bridge`  
> Data: `2026-10-14`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

## 1. Resumo executivo

Esta feature estabelece a primeira ponte direta de interoperabilidade entre o estúdio visual desktop **Polotno Studio** e a plataforma de publicação social **Postiz Web**, respondendo à Pergunta 3 do relatório de validação da arquitetura. Por meio de uma nova ferramenta no servidor MCP (`export_to_postiz`), agentes de IA e o usuário podem renderizar designs do Polotno e transferi-los automaticamente para a biblioteca de mídia do Postiz via API HTTP, viabilizando agendamentos multicanal imediatos.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura` | Polotno Studio (Electron / MCP) e Postiz (Next.js / NestJS) coexistem como subsistemas do HupFlow sem barramento de integração nativo. | 🟢 |
| `_reversa_sdd/questions.md#pergunta-3` | Pergunta 3 questiona como designs do Polotno Studio devem ser consumidos pelo Postiz na versão final. | 🟢 |
| `polotno-studio-app-master/src/mcp-server/tools.ts:306-344` | Ferramenta `export_design` já renderiza páginas em PNG, JPEG e PDF para disco via IPC bridge. | 🟢 |
| `postiz-app-main/apps/backend/src/api/routes/media.controller.ts:130-150` | Endpoint `POST /media/upload-simple` aceita uploads multipart e os associa à organização do token. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Criador de Mídia / Agente de IA | Criar um criativo visual no Polotno Studio e publicá-lo em redes sociais pelo Postiz com 1 comando. | Após diagramar um post no Polotno Studio, o agente executa `export_to_postiz` com o `designId` e o token Postiz; o criativo é enviado diretamente para a biblioteca de mídia do Postiz, pronto para agendamento. |

## 4. Regras de negócio novas ou alteradas

1. **RN-BRIDGE-01: Exportação e Upload Direto via MCP** 🟢
   - Origem no legado: `polotno-studio-app-master/src/mcp-server/tools.ts`
   - Tipo: nova
   - Descrição: A ferramenta MCP `export_to_postiz` deve renderizar o design especificado no formato desejado (`png`, `jpeg` ou `pdf`), converter os bytes e enviá-los via requisição HTTP `multipart/form-data` diretamente para o endpoint `/media/upload-simple` do Postiz.

2. **RN-BRIDGE-02: Associação Multi-tenant com Token do Postiz** 🟢
   - Origem no legado: `postiz-app-main/apps/backend/src/services/auth/auth.middleware.ts`
   - Tipo: preservada
   - Descrição: A requisição para o Postiz deve conter o cabeçalho `auth` com o token do usuário, garantindo que o criativo seja vinculado à organização ativa correta.

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Criar ferramenta `export_to_postiz` no registro `TOOLS` do servidor MCP do Polotno | Must | Aceitar `designId`, `format`, `token` e opcional `apiUrl` | 🟢 |
| RF-02 | Fazer upload multipart para o Postiz Backend via Fetch / FormData nativo do Node.js | Must | Enviar os buffers de imagem sem dependência de escrita em disco local | 🟢 |
| RF-03 | Retornar metadados da mídia salva no Postiz (`id`, `name`, `path`) | Must | Resposta JSON clara para consumo pelo agente ou usuário | 🟢 |
| RF-04 | Tratamento de falhas de rede, token expirado (403) ou formato inválido | Should | Mensagens de erro informativas caso o servidor Postiz esteja offline ou não autenticado | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Upload em stream / buffer | Evita I/O desnecessário em disco, transmitindo os dados em memória | 🟢 |
| Interoperabilidade | Compatibilidade MCP e HTTP | Funciona tanto via protocolo Anthropic MCP quanto via dispatcher HTTP | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Exportação bem-sucedida do Polotno para o Postiz
  Dado um design ativo com designId "design-1" no Polotno Studio
  E um token de autenticação válido do Postiz
  Quando a ferramenta export_to_postiz for invocada com format "png"
  Então o Polotno renderiza o design
  E envia os bytes via POST /media/upload-simple para a API do Postiz
  E retorna o id e a url da mídia salva na organização do usuário

Cenário: Falha de autenticação no Postiz
  Dado um token inválido ou ausente
  Quando a ferramenta export_to_postiz for invocada
  Então uma mensagem de erro explicativa 403 Forbidden é retornada sem quebrar o Polotno Studio
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Superfície de ferramenta MCP para agentes |
| RF-02 | Must | Mecanismo de transmissão HTTP |
| RF-03 | Must | Confirmação da mídia associada |
| RF-04 | Should | Resiliência e diagnóstico |

## 9. Esclarecimentos

> Modo autônomo ativado: dúvidas convertidas em premissas explícitas.

## 10. Lacunas

- 🟡 [DÚVIDA] Qual URL padrão adotar para o Postiz Backend quando não especificada?
  - *Premissa assumida*: `process.env.POSTIZ_API_URL` com fallback para `http://localhost:3000`.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-requirements` no modo autônomo | reversa |
