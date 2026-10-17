# Pontos de Vigilância de Regressão: Marca d'Água (Watermark Overlay) & Selos Corporativos

> Identificador da Feature: `029-hupflow-media-watermark-overlay`  
> Data: `2026-10-16`  
> Suite de Testes: `hupflow/src/lib/watermark/watermark.test.ts`  

---

## 1. Novos Pontos de Vigilância (W056 - W058)

### [W056] Clamping Anti-Transbordo e Margens em Mídias Pequenas
- **Risco**: Em imagens com dimensões reduzidas ou proporções extremas (ex: banners ultra-largos), o selo de marca d'água exceder os limites da mídia ou gerar coordenadas `(x, y)` negativas, quebrando o renderizador.
- **Detecção**: A função `calculateWatermarkCoordinates` implementa clamping estrito com `Math.max(0, Math.min(coord, maxCoord))`, garantindo que o selo nunca ultrapasse os limites visíveis.
- **Mitigação**: Testes unitários com mídias reduzidas de 100x100px validam o confinamento sem exceções.

### [W057] Não-Destrutividade dos Ativos Originais no Storage
- **Risco**: A aplicação de marca d'água sobrescrever o arquivo original de alta resolução no bucket R2/S3, impedindo que o usuário recupere a foto sem selo para outros usos.
- **Detecção**: As coordenadas e configurações de marca d'água são tratadas como metadados/overlays de publicação; os arquivos originais em `media_assets` permanecem imutáveis.
- **Mitigação**: O processo de publicação gera uma derivação temporária para o envio às redes sociais.

### [W058] Fallback Seguro para Logotipos Ausentes no Brand Kit
- **Risco**: Um usuário ativar marca d'água do tipo `logo` ou `combined` sem ter enviado um arquivo de logotipo no Brand Kit, resultando em ícones quebrados ou falha visual.
- **Detecção**: O componente `WatermarkPreviewCard` e o serviço utilizam um selo geométrico SVG elegante (`Shield`) com gradiente da marca caso o `logoUrl` seja nulo.
- **Mitigação**: A renderização é resiliente e nunca resulta em imagem quebrada.
