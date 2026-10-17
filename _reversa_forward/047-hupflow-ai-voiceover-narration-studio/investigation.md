# Investigação — Feature 047: Estúdio de Narração e Text-to-Speech (TTS) com Vozes Neurais

## 1. Padrões de Áudio e Taxa de Fala (Cadência Humana)
- Em português brasileiro, a cadência padrão de fala de narração profissional oscila entre **130 e 160 palavras por minuto (WPM)**.
- Para vídeos verticais acelerados (TikTok/Reels), a cadência ideal sobe para **160 a 185 WPM**.
- Se um roteiro tiver 150 palavras a 1.0x de velocidade, a duração estimada é de:
  $$\text{Duração (s)} = \left(\frac{\text{Palavras}}{\text{WPM}}\right) \times 60 \div \text{Velocidade}$$

## 2. Decisão de Design e Clean-Room
- Prover uma arquitetura flexível baseada em perfis de voz neurais (`VoiceProfile`) e endpoints modulares que podem se conectar nativamente tanto à Web Speech API nativa do navegador (zero custo, 100% offline no cliente) quanto a provedores BYOK (ElevenLabs, OpenAI Audio TTS, Google Cloud TTS) com fallback seguro.
