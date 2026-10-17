# Pontos de Vigilância de Regressão: Encurtador de Links & Tags UTM

> Identificador da Feature: `027-hupflow-custom-shortlinks-utm`  
> Data: `2026-10-16`  
> Suite de Testes: `hupflow/src/lib/shortlinks/shortlinks.test.ts`  

---

## 1. Novos Pontos de Vigilância (W050 - W052)

### [W050] Redirecionamento HTTP 302 vs 301 para Preservação de Telemetria
- **Risco**: Configurar o redirecionamento com código HTTP 301 (Permanent Redirect), fazendo com que navegadores e intermediários façam cache definitivo no lado do cliente, ignorando requisições subsequentes ao endpoint e quebrando o rastreamento em tempo real de cliques do mesmo usuário.
- **Detecção**: O endpoint `/l/[slug]/route.ts` retorna estritamente `NextResponse.redirect(result.destinationUrl, { status: 302 })`.
- **Mitigação**: O uso de 302 (Found) garante que cada acesso transite pelo servidor para registrar o evento na tabela `short_link_clicks`.

### [W051] Unicidade Global de Slugs e Prevenção de Colisão Criptográfica
- **Risco**: Dois usuários ou organizações gerarem ou cadastrarem o mesmo slug, provocando sequestro de rota ou redirecionamento incorreto.
- **Detecção**: A coluna `slug` possui restrição única (`unique()`) no banco de dados. Na criação de slug automático, o gerador executa consulta de disponibilidade em loop com limite de tentativas. Na criação de slug personalizado, o sistema rejeita duplicatas com erro 400 explicativo.
- **Mitigação**: O alfabeto Base62 com 6 caracteres provê ~56.8 bilhões de combinações, com baixa probabilidade de colisão e validação transacional antes da inserção.

### [W052] Preservação de Fragmentos de URL e Parâmetros Pré-existentes
- **Risco**: A injeção de parâmetros UTM (`utm_source`, `utm_medium`, etc.) sobrescrever ou truncar query parameters já existentes na URL de destino do usuário (ex: tokens de afiliados, IDs de produto ou âncoras `#`).
- **Detecção**: A função `buildUtmUrl` analisa a URL via `new URL()`, utilizando `searchParams.set(...)`, o que preserva query strings preexistentes e fragmentos de âncora intactos.
- **Mitigação**: A suíte de testes unitários `shortlinks.test.ts` valida explicitamente URLs contendo parâmetros prévios (`?ref=banner`).
