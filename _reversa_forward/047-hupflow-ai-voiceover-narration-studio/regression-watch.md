# Pontos de Atenção & Monitoramento de Regressão — Feature 047

## W098 — Estimativa de Duração vs Taxa de Fala (Pacing)
- **Risco**: Roteiros com pontuação irregular ou caracteres especiais podem distorcer o cálculo de WPM (palavras por minuto) e estimar incorretamente a duração para vídeos verticais (ex: limite de 60s do YouTube Shorts).
- **Salvaguarda**: `estimateSpeechDurationSeconds` limita a taxa efetiva mínima a 60 WPM e garante duração mínima de 2 segundos. Recomenda-se alertar o usuário quando a duração ultrapassar o teto da mídia vertical correspondente.

## W099 — Multi-tenant na Tabela `voiceover_tracks`
- **Risco**: Vazamento de faixas de áudio personalizadas ou scripts confidenciais de campanhas entre agências ou clientes distintos.
- **Salvaguarda**: Toda leitura e escrita em `src/lib/voiceover/service.ts` e nas rotas de API filtra estritamente por `organizationId` obtido através do token de sessão validado por `requireOrgRole`.
