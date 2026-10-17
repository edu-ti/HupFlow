# Watchpoints de Regressão — Feature 043: Seletor Rápido & Workspace Switcher de Agência Multi-Marca

## Pontos Críticos Monitorados

### `W090: Integridade dos Cookies de Tenant Context na Alternância Rápida`
- **Contexto**: A alternância de marca precisa atualizar o identificador da organização de destino sem invalidar os tokens de autenticação da sessão do usuário.
- **Risco**: Se o cookie for definido incorretamente ou com escopo inadequado, o usuário pode perder o login ou acessar dados da marca anterior por cache.
- **Mitigação**: O endpoint `/api/agency/switch` valida a existência do perfil de marca e emite cabeçalhos `Set-Cookie` com `SameSite=Lax`, `Path=/` e `maxAge=30d`, forçando o reload limpo do estado do cliente.

### `W091: Ordenação Prioritária de Marcas Favoritas (Pinned)`
- **Contexto**: Operadores gerenciam dezenas de marcas mas acessam diariamente um subconjunto restrito de clientes de alta demanda.
- **Risco**: Perda de produtividade se marcas marcadas com estrela não aparecerem no topo da lista.
- **Mitigação**: O comparador determinístico `filterAgencyBrands` garante que `isFavorite === true` tenha precedência absoluta sobre número de posts agendados e ordem alfabética.
