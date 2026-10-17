# Investigação — Feature 044: Gerador de Mockups Dinâmicos de Vídeo & Dispositivos

## 1. Abordagens Existentes e Limitações
- Ferramentas tradicionais utilizam WebGL/Three.js com modelos GLTF de mais de 15MB ou dependem de serviços de terceiros via API (como Placeit ou Shots.so) que exigem assinaturas externas ou ferem o princípio Clean-Room.
- Nossa abordagem Clean-Room utiliza **SVG paramétrico de alta fidelidade** aliado a transformações CSS de perspectiva 3D e clip-paths modernos:
  - Tamanho leve (< 15KB de código vetorial).
  - Renderização instantânea sem carregamento de assets 3D pesados.
  - Compatibilidade com exportação nativa em Canvas HTML5 (`toDataURL('image/png')`) e vetores SVG para impressos e apresentações em alta resolução.

## 2. Geometria dos Dispositivos
1. **iPhone 16 Pro**:
   - Aspect ratio: ~19.5:9
   - Curvatura de borda (border-radius): 54px
   - Dynamic Island: Cápsula centralizada de 125x35px no topo
   - Bisel ultrafino (ultra-thin bezel): 8px
2. **iPad Pro 13"**:
   - Aspect ratio: ~4:3
   - Curvatura suave de 24px, câmera frontal discreta em modo paisagem/retrato.
3. **MacBook Air 15"**:
   - Aspect ratio tela: 16:10
   - Notch discreto no topo, base de teclado e dobradiça de alumínio escovado.
