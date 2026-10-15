# Actions: Ponte Polotno Studio (MCP) ➔ Postiz Web

> Identificador: `004-polotno-postiz-bridge`  
> Data: `2026-10-14`  
> Roadmap: `_reversa_forward/004-polotno-postiz-bridge/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 3 |
| Paralelizáveis (`[//]`) | 0 |
| Maior cadeia de dependência | 3 |

## Fase 1, Preparação

<!-- Setup MCP e IPC bridge já existentes no Polotno Studio. -->

## Fase 2, Testes

<!-- Validação via tipagem TypeScript e invocação de ferramenta. -->

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Implementar a ferramenta `export_to_postiz` no array `TOOLS` de `tools.ts` com upload multipart para o Postiz Backend | - | - | `polotno-studio-app-master/src/mcp-server/tools.ts` | 🟢 | `[X]` |
| T002 | Registrar o alias `postiz` e `publish` em `VERB_ALIASES` no `tools.ts` para acesso via HTTP | T001 | - | `polotno-studio-app-master/src/mcp-server/tools.ts` | 🟢 | `[X]` |

## Fase 4, Integração

<!-- A integração ocorre via chamada HTTP direta ao endpoint existente /media/upload-simple. -->

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Validar sintaxe TypeScript e tratamento de respostas HTTP no handler de exportação | T002 | - | `polotno-studio-app-master/src/mcp-server/tools.ts` | 🟢 | `[X]` |

## Notas de execução
- Tarefas T001, T002 e T003 concluídas com sucesso sob política de segurança `allowLegacyEdits: true` no escopo `polotno-studio-app-master/**`.
- Implementada a renderização de páginas via IPC bridge e upload multipart direto para o endpoint `/media/upload-simple` do Postiz com cabeçalho `auth: token`.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-to-do` no modo autônomo | reversa |
| 2026-10-14 | Conclusão das tarefas T001 a T003 em `/reversa-coding` | reversa |
