# Investigação Técnica: Feature 023 - Chaves de API Públicas

> Identificador: `023-hupflow-public-api-keys`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Análise da Arquitetura de Autenticação

1. **Padrão de Chaves de API**:
   - Chaves com prefixo reconhecível (`hup_live_`) evitam confusão com segredos de webhook (`whsec_`) ou tokens JWT.
   - O uso de SHA-256 para hashing de API keys é a recomendação padrão de segurança (utilizado por Stripe, GitHub e Resend), pois as chaves possuem entropia criptográfica muito alta (> 128 bits), tornando ataques de força bruta computacionalmente inviáveis sem a necessidade de algoritmos lentos como bcrypt ou argon2.

2. **Verificação de Escopos Granulares**:
   - Cada chave armazena uma lista de strings em formato JSON: `scopes: string[]`.
   - Helper `hasScope(apiKeyScopes: string[], requiredScope: string): boolean`:
     - Retorna `true` se `apiKeyScopes.includes(requiredScope)` ou `apiKeyScopes.includes('*')`.

3. **Integração Não-Bloqueante com Drizzle**:
   - A tabela `api_keys` possui índice único no campo `key_hash`, permitindo lookup `O(1)` em cada requisição de API.
   - O carimbo de `last_used_at` é atualizado em background sem bloquear o retorno da requisição.

---

## 2. Decisões Arquiteturais Clean-Room

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Algoritmo de Hash | SHA-256 (`node:crypto`) | Alta performance (< 1ms) e segurança robusta para tokens com entropia de 256 bits. |
| Exibição do Segredo | Apenas no momento da criação | Previne vazamentos caso o banco de dados seja comprometido. |
| Prefixos Visíveis | `hup_live_xxxx...` (primeiros 14 caracteres) | Permite ao usuário identificar visualmente qual chave está em uso sem expor o segredo. |
| Multi-tenant | `organizationId` obrigatório | Cada chave está estritamente vinculada a um único workspace. |
