# Regression Watch — Feature 031: Smart Link-in-Bio Multi-Link & Showcase

Pontos de vigilância de regressão para monitorar durante a evolução contínua das páginas públicas de bio e telemetria de cliques.

---

### W062: Unicidade e Conflito de Handles Globais
- **Cenário de Risco**: Dois workspaces diferentes tentarem registrar o mesmo `handle` (ex: `/bio/marketing`), gerando colisão de chaves únicas no banco e erro 500 para o usuário.
- **Mecanismo de Proteção**:
  - Restrição `unique()` no campo `handle` em `bio_profiles`.
  - Função `sanitizeHandle` remove caracteres especiais, acentuação e força minúsculas.
  - O endpoint de gravação captura erros de colisão de chave única e retorna mensagem amigável 400 com indicação clara para o usuário escolher outro identificador.
- **Verificação**:
  - Testes unitários em `bio.test.ts` cobrem sanitização e validação de formato e comprimento.

---

### W063: Telemetria Não-Bloqueante e Proteção contra Spam de Cliques
- **Cenário de Risco**: Registro síncrono de cliques em `/api/bio/click` atrasar o redirecionamento do visitante ou sofrer flooding por scripts automatizados.
- **Mecanismo de Proteção**:
  - O endpoint `/api/bio/click` responde com `200 OK` instantâneo sem bloquear a navegação.
  - Links na página pública utilizam atributos `<a>` nativos com fallback garantido para SEO e web crawlers.
- **Verificação**:
  - Testes manuais e unitários validam que `calculateBioCtr` trata com segurança cenários com 0 visualizações sem gerar `NaN` ou `Infinity`.

---

### W064: Acessibilidade Mobile e Contrastes em Temas Customizados
- **Cenário de Risco**: Cores claras em fundos claros nos temas customizados tornarem o texto dos botões ilegível para os visitantes.
- **Mecanismo de Proteção**:
  - A função `getThemeConfig` utiliza paletas predefinidas rigorosamente contrastantes (Tailwind `zinc-950` vs `zinc-100`, `white` vs `zinc-900`, gradientes vibrantes com texto branco).
- **Verificação**:
  - Validação visual no simulador `BioPhonePreview.tsx` em todos os 5 temas predefinidos.
