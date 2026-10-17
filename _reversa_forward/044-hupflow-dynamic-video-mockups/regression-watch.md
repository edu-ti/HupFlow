# Watchpoints de Regressão — Feature 044: Gerador de Mockups Dinâmicos de Vídeo & Dispositivos

## Pontos Críticos Monitorados

### `W092: Preservação de Proporção e Clip-Path dos Dispositivos`
- **Contexto**: Diferentes dispositivos possuem raios de curvatura e proporções de tela específicas (ex: iPhone 16 Pro com 50px de border radius e Dynamic Island; MacBook com 16:10).
- **Risco**: Se a imagem da tela não for recortada (`clip-path`) ou distorcida, o criativo parecerá artificial ou vazará pelas bordas metálicas.
- **Mitigação**: O gerador puro `calculateDeviceDimensions` padroniza os eixos `outerWidth`, `screenWidth`, `borderRadius` e `screenBorderRadius`, e o SVG utiliza `preserveAspectRatio="xMidYMid slice"` com gradiente de vidro sobreposto.

### `W093: Renderização Fluida de Vídeos em Loop sem Vazamento de Recursos`
- **Contexto**: Quando um mockup utiliza vídeo MP4 na tela, a reprodução contínua deve ser leve.
- **Risco**: Bloqueio de autoplay pelos navegadores ou consumo excessivo de CPU.
- **Mitigação**: Os vídeos são renderizados com atributos nativos `autoPlay loop muted playsInline` dentro de `foreignObject`, garantindo compatibilidade multiplataforma.
