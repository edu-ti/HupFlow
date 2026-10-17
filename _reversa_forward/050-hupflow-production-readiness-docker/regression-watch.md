# Pontos de Atenção & Monitoramento de Regressão — Feature 050

## W104 — Variáveis de Ambiente no Docker Runner
- **Risco**: Iniciar o container sem `BETTER_AUTH_SECRET` ou `DATABASE_URL` válidas pode gerar crash em loop do processo Node.js.
- **Salvaguarda**: O `Dockerfile` possui probe HTTP embutido (`HEALTHCHECK`), e a aplicação conta com tratamento resiliente com fallback em memória no caso de desconexão momentânea do PostgreSQL.

## W105 — Permissões de Usuário Não-Root no Container
- **Risco**: Tentativa de escrita em diretórios protegidos do filesystem do container falhar por restrição de permissão do usuário `nextjs` (UID 1001).
- **Salvaguarda**: O Dockerfile define explicitamente a propriedade de `.next` e arquivos estáticos para `chown nextjs:nodejs`, garantindo conformidade com padrões CIS Docker Benchmark e OpenShift/K8s Restrictive SCC.
