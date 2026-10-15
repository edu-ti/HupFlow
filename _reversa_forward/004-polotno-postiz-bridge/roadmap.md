# Roadmap: Ponte Polotno Studio (MCP) ➔ Postiz Web

> Identificador: `004-polotno-postiz-bridge`  
> Data: `2026-10-14`  
> Requirements: `_reversa_forward/004-polotno-postiz-bridge/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

## 1. Resumo da abordagem

Esta evolução constrói a integração nativa entre o Polotno Studio e o Postiz. No servidor MCP do Polotno (`src/mcp-server/tools.ts`), adicionaremos a ferramenta `export_to_postiz`. A ferramenta renderiza as páginas do design via IPC bridge (`exec(designId, { type: 'export', ... })`), converte o `dataUrl` em `Blob`/Buffer e dispara um `fetch` multipart/form-data para `POST /media/upload-simple` no Postiz Backend, passando o cabeçalho de autenticação `auth: <token>`. O retorno traz a confirmação com o ID da mídia e o path no Postiz, completando a interoperabilidade da suíte.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Interoperabilidade de Módulos | Transforma subsistemas isolados em um ecossistema coeso de criação e publicação. | respeita |
| Automação Orientada a Agentes | Permite que assistentes de IA (via MCP) criem designs e os publiquem sem intervenção manual de download/upload. | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Adicionar `export_to_postiz` ao registro de ferramentas `TOOLS` do MCP Server | O MCP Server já é o canal oficial de automação por IA do Polotno Studio | Criar um botão estático na UI Electron sem expor para MCP | 🟢 |
| D-02 | Utilizar `FormData` nativo do Node.js (disponível no Node 18+) para o upload HTTP | Elimina a necessidade de instalar pacotes npm adicionais no Electron | Salvar em arquivo temporário em disco antes do upload | 🟢 |
| D-03 | Reutilizar o endpoint `/media/upload-simple` já existente no Postiz Backend | O endpoint já valida multi-tenant, salva o arquivo e cria o registro na tabela de mídias | Criar um novo endpoint customizado | 🟢 |

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| O runtime Node do servidor MCP possui suporte a `fetch` e `FormData` nativos | Node 18+ padrão no Electron 39 | Falha de runtime em versões legadas de Node |

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `PolotnoMcpTools` | `polotno-studio-app-master/src/mcp-server/tools.ts` | contrato-novo | Adiciona ferramenta `export_to_postiz` ao array `TOOLS`. |

## 6. Delta no modelo de dados

- Resumo das mudanças: Nenhuma modificação no schema Prisma; utiliza o modelo existente de `Media` no banco de dados do Postiz.
- Detalhe completo em: `_reversa_forward/004-polotno-postiz-bridge/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| `export_to_postiz` | MCP Tool (JSON-RPC) / HTTP | `_reversa_forward/004-polotno-postiz-bridge/interfaces/mcp-export-to-postiz.md` |

## 8. Plano de migração

Não há migração de banco de dados.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Postiz Backend offline ou porta diferente | Médio | Média | Parâmetro opcional `apiUrl` e fallback com mensagens de erro claras |
| Token inválido ou expirado | Baixo | Média | Retorno de erro capturando HTTP 401/403 com orientação ao usuário |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Ferramenta `export_to_postiz` declarada e tipada em `tools.ts`
- [ ] Handler com renderização de páginas, montagem de FormData e upload para Postiz
- [ ] Adendo gerado em `_reversa_sdd/addenda/004-polotno-postiz-bridge.md`

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-plan` no modo autônomo | reversa |
