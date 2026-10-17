# Interfaces de UI — Feature 047: Estúdio de Narração e Text-to-Speech (TTS) com Vozes Neurais

## 1. Card de Faixa de Narração `VoiceoverTrackCard.tsx`
- Avatar do perfil de voz (Gênero, Bandeira do idioma pt-BR/en-US e Persona).
- Player de áudio com botão Play/Pause, barra de progresso e visualização simulada de forma de onda (waveform).
- Contador de palavras e duração exata (ex: `124 palavras • 00:46s`).
- Botão "Baixar Áudio (MP3)" e botão "Copiar Link de Áudio".

## 2. Estúdio de Gravação `/settings/voiceover`
- Editor de Roteiro com contador de caracteres, palavras e estimativa de tempo em tempo real.
- Grade de Personas Neurais com escuta de amostra rápida (1 clique).
- Controles de velocidade (0.75x a 1.5x) e tom de voz (Grave, Equilibrado, Agudo).
- Botão "Sintetizar Narração com IA" com animação de forma de onda.
- Galeria de faixas criadas.
