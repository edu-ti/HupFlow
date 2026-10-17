# Requisitos: Aplicação de Marca d'Água (Watermark Overlay) & Selos Corporativos

> Identificador da Feature: `029-hupflow-media-watermark-overlay`  
> Data: `2026-10-16`  
> Cenário: `greenfield` (Alinhado ao PRD Clean-Room, Brand Kits e Biblioteca de Mídias)  

---

## 1. Visão Geral

Para marcas, agências e criadores de conteúdo, manter consistência visual e proteger seus ativos contra republicação não autorizada nas redes sociais exige a inserção de selos de marca d'água (*watermarks*) e handles (@marca) em fotos, artes gráficas e carrosséis.

Esta feature introduz o subsistema de **Marca d'Água & Selos Corporativos Automáticos** do HupFlow, permitindo:
1. Configurar regras de branding com logotipo e handle da empresa (integrados ao Brand Kit).
2. Posicionar o selo em qualquer um dos 4 cantos ou centro da imagem com margens de respiro e ajuste de opacidade/escala.
3. Pré-visualizar instantaneamente a aplicação em formatos quadrado (1:1) e vertical Stories/Reels (9:16).
4. Ativar aplicação automática em todas as publicações agendadas do workspace ou acionamento seletivo manual.

---

## 2. Requisitos Funcionais (RF)

- **RF-001 (Configurações de Marca d'Água)**:
  - Armazenar preferências na tabela `watermark_settings` vinculada à organização (`organization_id`).
  - Tipo de selo: `logo` (apenas logotipo), `text` (apenas `@handle` ou texto), `combined` (logo + texto lado a lado).
  - Posição: `bottom_right`, `bottom_left`, `top_right`, `top_left`, `center`.
  - Opacidade ajustável de 0.1 a 1.0 (10% a 100%).
  - Escala proporcional de 0.05 a 0.35 (5% a 35% da dimensão da imagem).
  - Margem de respiro de borda em pixels.
  - Opção de aplicação automática (*auto-apply*) no agendamento.
- **RF-002 (Cálculo Geométrico de Coordenadas)**:
  - Função matemática pura `calculateWatermarkCoordinates` para determinar `(x, y)` sem distorção e respeitando margens de segurança para qualquer aspect ratio.
- **RF-003 (Endpoints de API)**:
  - `GET /api/watermark`: obtém as configurações ativas do workspace (ou defaults inteligentes puxados do Brand Kit).
  - `POST /api/watermark`: cria ou atualiza as configurações com RBAC (`member` ou `admin`).
- **RF-004 (Painel Visual de Configurações & Preview)**:
  - Tela `/settings/watermark` com seletor interativo de quadrantes (grid de 9 posições), sliders em tempo real de opacidade e escala, e preview dinâmico de alta fidelidade.
- **RF-005 (Atalho no Menu Lateral)**:
  - Inclusão do item "Marca d'Água" no menu do dashboard em `layout.tsx`.

---

## 3. Requisitos Não-Funcionais (RNF)

- **RNF-001 (Clean-Room Estrito)**: Zero bibliotecas AGPL ou serviços proprietários de terceiros; cálculos puramente matemáticos e manipulação em Canvas/CSS/SVG nativos.
- **RNF-002 (Isolamento Multi-Tenant)**: Cada workspace possui suas próprias regras de marca d'água isoladas por `organization_id`.
- **RNF-003 (Performance & Não-destrutividade)**: As coordenadas e sobreposições são calculadas de maneira não-destrutiva, preservando os arquivos originais intactos no storage R2/S3.
- **RNF-004 (TypeScript Estrito)**: Zero erros de compilação em `tsc --noEmit`.
