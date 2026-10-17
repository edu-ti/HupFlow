# Requisitos — Feature 044: Gerador de Mockups Dinâmicos de Vídeo & Dispositivos

## 1. Visão Geral do Módulo
Agências, gestores de tráfego pago e criadores precisam apresentar seus criativos (anúncios no Instagram Stories, Reels, TikToks, carrosséis do LinkedIn e landing pages) dentro de molduras de dispositivos premium fotorrealistas (iPhone 16 Pro com Dynamic Island, iPad Pro com Magic Keyboard, MacBook Air).

A Feature 044 implementa um gerador de mockups 100% nativo em SVG e Canvas HTML5, sem dependências de APIs pagas de renderização 3D externa:
- Molduras vetoriais escaláveis e precisas para iPhone 16 Pro, iPad Pro e MacBook Air com reflexos e sombras dinâmicas.
- Inserção de mídia (imagem PNG/JPG ou vídeo MP4/WebM) com recorte automático nos raios de borda nativos de cada aparelho.
- Personalização de acabamento: Titânio Preto, Titânio Natural, Prata e Midnight.
- Download em 1 clique em alta resolução (PNG 2x/4x) e exportação em SVG transparente para materiais de vendas e apresentações para clientes.

## 2. Requisitos Funcionais
- **RF01**: Selecionar dispositivo (`iphone_16_pro`, `ipad_pro`, `macbook_air`, `apple_watch`).
- **RF02**: Ajustar orientação (`portrait`, `landscape`), acabamento de material (`titanium_black`, `natural_titanium`, `silver`, `midnight`) e intensidade de sombra (`none`, `soft`, `floating_3d`).
- **RF03**: Carregar imagem/vídeo da Biblioteca de Mídias (`hupflow/src/lib/media`) ou inserir URL de criativo.
- **RF04**: Pré-visualização instantânea interativa com zoom e rotação leve em perspectiva 3D (CSS perspective transforms).
- **RF05**: Salvar templates de mockups favoritos no catálogo da organização.
- **RF06**: Exportar resultado em SVG ou disparar download de PNG transparente.

## 3. Requisitos Não-Funcionais
- **RNF01**: 100% Clean-Room TypeScript sem dependências de SDKs 3D proprietários (zero Three.js pesado ou serviços pagos de mockup em nuvem).
- **RNF02**: Isolamento de tenant por `organizationId` com RBAC `requireOrgRole`.
- **RNF03**: Resiliência com fallback pré-populado em memória para testes offline e modo demo.
