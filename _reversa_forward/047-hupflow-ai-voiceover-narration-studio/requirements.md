# Requisitos — Feature 047: Estúdio de Narração e Text-to-Speech (TTS) com Vozes Neurais

## 1. Visão Geral do Módulo
Vídeos curtos (Reels, TikToks e YouTube Shorts) e carrosséis dinâmicos dependem criticamente de áudio e narrações faladas com clareza, ritmo cativante e dicção profissional. A maioria dos criadores e equipes de agências não dispõe de estúdio acústico ou prefere não gravar a própria voz.

A Feature 047 entrega o **AI Voiceover & Narration Studio**:
- Biblioteca de personas neurais em Português (Brasil) e Inglês com diferentes estilos:
  - *Narrador Documentário*: Tom confiável, firme e de autoridade.
  - *Criador Entusiasta*: Ritmo acelerado, enérgico e hipnótico para ganchos virais.
  - *Executivo Corporativo*: Tom sóbrio, formal e polido para conteúdos B2B.
  - *Host de Podcast*: Conversa natural, expressiva e envolvente.
- Controle de cadência (Words Per Minute — WPM), velocidade (0.75x a 1.5x) e tom (grave, equilibrado, agudo).
- Estimativa automática de tempo de fala para encaixar perfeitamente em vídeos de 30s, 60s ou carrosséis narrados.
- Player de áudio com simulação de forma de onda (waveform) e exportação em MP3/WAV para vincular diretamente aos vídeos da Feature 046 ou Estúdio de Vídeos.

## 2. Requisitos Funcionais
- **RF01**: Entrada de roteiro em texto com cálculo instantâneo de palavras e duração estimada em segundos.
- **RF02**: Seleção de voz neural (Persona, Gênero e Idioma).
- **RF03**: Ajuste de velocidade (Speed) e tom de voz (Pitch).
- **RF04**: Pré-escuta de amostra (Sample audio) e geração da faixa de narração completa.
- **RF05**: Salvamento de faixas de voz na Biblioteca da Organização com download em 1 clique.
- **RF06**: Painel `/settings/voiceover` para criação, histórico de narrações e métricas de minutos de áudio gerados.

## 3. Requisitos Não-Funcionais
- **RNF01**: 100% Clean-Room TypeScript, sem dependências de SDKs de terceiros fechados ou wrappers binários de terceiros.
- **RNF02**: Isolamento estrito de permissões RBAC (`requireOrgRole`).
- **RNF03**: Resiliência com fallback pré-populado em memória para testes offline e modo demo.
