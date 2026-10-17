# Requisitos — Feature 046: Conectores Oficiais & Agendador Nativo para TikTok & YouTube Shorts

## 1. Visão Geral do Módulo
Vídeos curtos em proporção vertical 9:16 são o principal motor de alcance algorítmico e descoberta em 2026. A publicação nessas plataformas (TikTok Content Posting API e YouTube Data API v3 para Shorts) exige rigorosas regras de validação prévia de mídia para evitar rejeições de processamento nos servidores da Meta, ByteDance e Google:
- Validação automática de proporção (Aspect Ratio estritamente 9:16 ou entre 0.54 e 0.58).
- Resolução mínima Full HD (1080x1920) e taxa de quadros (23 a 60 fps).
- Limite de duração: 3 a 60 segundos para YouTube Shorts; 3 a 600 segundos para TikTok.
- Configuração de privacidade: `public`, `unlisted`, `private` ou `friends_only`.
- Opções avançadas do TikTok: desativar comentários, desativar duet/stitch e marcação de conteúdo gerado por IA (AIGC disclosure).
- Pré-visualização com simulação de interface nativa (feed do TikTok e Shorts com botões laterais de like/comentário).

## 2. Requisitos Funcionais
- **RF01**: Upload e validação de arquivos de vídeo MP4/MOV com inspeção de metadata.
- **RF02**: Suporte a agendamento independente ou simultâneo para TikTok e YouTube Shorts.
- **RF03**: Sanitização de legendas e inserção automática de hashtags `#Shorts` para YouTube.
- **RF04**: Configuração de thumbnail/capa com seleção de frame do vídeo.
- **RF05**: Tratamento de status de upload: `draft`, `scheduled`, `uploading`, `published`, `processing_error`.
- **RF06**: Painel `/settings/vertical` para gerenciamento da fila de vídeos 9:16 com pré-visualização.

## 3. Requisitos Não-Funcionais
- **RNF01**: 100% Clean-Room TypeScript, sem dependências de SDKs de terceiros fechados ou wrappers binários de terceiros.
- **RNF02**: Isolamento estrito de permissões RBAC (`requireOrgRole`).
- **RNF03**: Resiliência com fallback pré-populado em memória para testes offline e modo demo.
