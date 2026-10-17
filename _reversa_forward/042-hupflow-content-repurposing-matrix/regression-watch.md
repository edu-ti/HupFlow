# Watchpoints de Regressão — Feature 042: Matriz de Reaproveitamento Multi-Formato IA

## Pontos Críticos Monitorados

### `W088: Validação Rígida do Limite de 280 Caracteres nos Tweets da Thread`
- **Contexto**: O X (antigo Twitter) impõe um limite de caracteres para postagens padrão de 280 caracteres.
- **Risco**: Se a IA gerar um texto mais longo sem truncamento seguro, a publicação via API falhará.
- **Mitigação**: O gerador puro `generateXThread` valida o comprimento e aplica truncamento de segurança com reticências preservando a integridade sintática e a contagem exata `<= 280`.

### `W089: Isolamento de Memória por Organização (Multi-Tenant)`
- **Contexto**: Usuários de agências operam dezenas de clientes simultâneos sem vazamento de ideias ou transcrições proprietárias.
- **Risco**: Misturar rascunhos de clientes concorrentes.
- **Mitigação**: Todas as consultas e operações do serviço `hupflow/src/lib/repurpose/service.ts` indexam estritamente por `organizationId` obtido através do token de sessão autenticado pelo RBAC `requireOrgRole`.
