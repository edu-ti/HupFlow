# Requirements: Editor Polotno Canvas Embutido no Postiz Web

> Identificador: `006-polotno-web-canvas`  
> Data: `2026-10-15`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

## 1. Resumo executivo

Esta feature aprimora e expande a experiência do estúdio gráfico **Polotno Canvas** integrado à plataforma **Postiz Web**. Ela disponibiliza seletores rápidos de proporção e resolução otimizados para as principais redes sociais (Instagram, LinkedIn, X, TikTok), viabiliza a edição e retoque de mídias já existentes no rascunho de postagem e simplifica o fluxo de criação visual diretamente no navegador, eliminando a dependência do aplicativo desktop para ajustes gráficos do dia a dia.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura` | O Polotno Studio coexiste com o Postiz no monorepo HupFlow; o Postiz Web já possui `polotno` no package.json e `polonto.css` em seus assets. | 🟢 |
| `_reversa_sdd/gaps.md#2-lacunas-moderadas-impactam-arquitetura-e-integração` | `GAP-MOD-01`: Sincronização entre Polotno e Postiz identificada como lacuna moderada de integração. | 🟢 |
| `_reversa_sdd/domain.md#12-domínio-polotno-studio-design-visual-desktop--mcp` | Definição de Design, Page, Element e Store do Polotno SDK. | 🟢 |
| `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx` | Componente inicial de canvas que renderiza `PolotnoContainer` com tamanho fixo (540x675) e upload para `/media/upload-simple`. | 🟢 |
| `postiz-app-main/apps/frontend/src/components/media/media.component.tsx:859-870` | Gatilho `designMedia` que abre o modal Polonto apenas se `user?.tier?.ai` estiver ativo. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Criador de Conteúdo / Social Media | Criar uma arte rápida ou retocar uma imagem antes de agendar uma publicação no Postiz. | Ao compor um post no Postiz Web, o usuário clica em "Criar/Editar Arte", escolhe a proporção desejada (ex: 1:1 Instagram ou 16:9 LinkedIn), adiciona elementos ou ajusta a imagem e salva direto no post com 1 clique. |
| Agência de Marketing Multicanal | Adaptar o mesmo criativo visual para múltiplos formatos de redes sociais sem precisar abrir ferramentas externas pesadas. | O designer cria a peça no Postiz, altera a proporção para Stories (9:16) ou Feed (4:5) e exporta variações vinculadas à campanha. |

## 4. Regras de negócio novas ou alteradas

1. **RN-CANVAS-01: 4 Presets de Proporção Social em Tempo Real** 🟢
   - Origem no legado: `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx:98-106`
   - Tipo: alterada
   - Descrição: O editor disponibiliza 4 botões rápidos no toolbar para ajuste dinâmico do canvas: 1:1 Quadrado (1080x1080 - Feed Instagram), 16:9 Paisagem (1200x675 - X/LinkedIn/Facebook), 9:16 Vertical (1080x1920 - Stories/Reels/TikTok) e 4:5 Retrato (1080x1350 - Instagram). Ao alternar, o Polotno SDK ajusta a prancheta mantendo o zoom centralizado.

2. **RN-CANVAS-02: Retoque com Substituição Contextual no Post** 🟢
   - Origem no legado: `postiz-app-main/apps/frontend/src/components/media/media.component.tsx`
   - Tipo: nova
   - Descrição: Ao retocar uma imagem existente via ícone de edição na miniatura, a imagem é carregada na prancheta. Ao concluir, a nova versão gerada substitui a mídia correspondente no rascunho do post atual, enquanto ambas as versões permanecem salvas na biblioteca de mídias da organização.

3. **RN-CANVAS-03: Democratização do Acesso ao Editor de Layout** 🟢
   - Origem no legado: `postiz-app-main/apps/frontend/src/components/media/media.component.tsx:860`
   - Tipo: alterada
   - Descrição: A ferramenta de design e layout visual é liberada para todos os usuários (inclusive sem plano de IA) para ferramentas essenciais de desenho, texto, formas e uploads. Seções exclusivas de IA (como Picture Generator) continuam respeitando os créditos da assinatura.

4. **RN-CANVAS-04: Pontos de Entrada Duplos na Interface** 🟢
   - Origem no legado: `postiz-app-main/apps/frontend/src/components/media/media.component.tsx`
   - Tipo: nova
   - Descrição: O editor pode ser acionado tanto pelo botão "Design Media" na área de uploads (iniciando em branco com seleção de preset) quanto pelo botão "Editar Arte" sobre cada miniatura de foto já anexada ao post.

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Barra de 4 Presets de Proporção no Toolbar do Polotno | Must | Botões de 1 clique (1:1, 16:9, 9:16 e 4:5) na barra superior que alteram o tamanho da página (`store.setPageSize`) com zoom ajustado. | 🟢 |
| RF-02 | Carregamento de Imagem Existente na Prancheta | Must | Suporte a parâmetro `initialMedia` que carrega a URL da imagem selecionada como elemento principal do canvas ao abrir. | 🟢 |
| RF-03 | Ícone de Ação "Editar Arte" nas Miniaturas de Upload | Must | Botão sobreposto na lista de miniaturas de mídias anexadas que dispara o modal do Polotno passando a imagem ativa. | 🟢 |
| RF-04 | Desbloqueio Geral do Acesso no `designMedia` | Must | Remoção do bloqueio rígido `user?.tier?.ai` para permitir que usuários de qualquer tier acessem o estúdio visual. | 🟢 |
| RF-05 | Substituição Limpa no Post e Persistência na Biblioteca | Must | Ao clicar em "Usar esta mídia", salvar via `/media/upload-simple`, substituindo a imagem original no post e mantendo o histórico de mídias. | 🟢 |
| RF-06 | Indicador de Carregamento e Tratamento de Erros | Should | Spinner durante a renderização do Blob e upload multipart com feedback claro de sucesso. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Renderização e redimensionamento suaves | `store.setPageSize` não deve causar recarregamento da página nem congelamento da interface. | 🟢 |
| Usabilidade | Feedback progressivo e visual moderno | Toolbar integrado harmoniosamente com o tema do Mantine UI e Tailwind CSS do Postiz. | 🟢 |
| Compatibilidade | Tipagem TypeScript estrita | Garantir compilação limpa no monorepo Postiz (`Next.js 16` + `React 19`). | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Seleção do preset 16:9 para LinkedIn/X
  Dado que o usuário abriu o modal de design no Postiz Web
  Quando clicar no botão de preset "16:9"
  Então o canvas é redimensionado para 1200x675
  E o zoom é ajustado automaticamente para caber na tela do modal

Cenário: Edição de imagem existente com substituição no post
  Dado que o usuário tem a imagem "banner.png" anexada ao rascunho de post
  Quando clicar no botão "Editar Arte" da miniatura
  Então o Polotno abre carregando "banner.png" na prancheta
  E ao aplicar um texto e clicar em "Usar esta mídia"
  Então a imagem editada substitui "banner.png" no post atual
  E "banner.png" original continua acessível na biblioteca da organização

Cenário: Acesso ao editor sem restrição de tier de IA
  Dado que o usuário está no plano Free
  Quando clicar em "Design Media" na área de uploads
  Então o modal do Polotno abre com ferramentas de texto, formas e presets liberados
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (4 Presets de proporção) | Must | Requisito essencial confirmado no clarify para atender redes sociais. |
| RF-02 (Carga de imagem existente) | Must | Núcleo do fluxo de retoque de fotos. |
| RF-03 (Ícone nas miniaturas) | Must | Ponto de entrada acordado no clarify. |
| RF-04 (Desbloqueio de acesso) | Must | Garante adoção e uso em todos os tiers. |
| RF-05 (Substituição no post) | Must | Comportamento definido no clarify. |
| RF-06 (Feedback e loader) | Should | Assegura usabilidade consistente. |

## 9. Esclarecimentos

### Sessão 2026-10-15
- **Q:** Como devem funcionar os seletores de tamanho e proporção no canvas do Polotno?  
  **R:** 4 Botões rápidos de redes sociais: 1:1 (Quadrado Instagram), 16:9 (X / LinkedIn), 9:16 (Stories / Reels / TikTok) e 4:5 (Retrato Instagram).
- **Q:** Ao retocar ou editar uma imagem já anexada no post, qual deve ser o comportamento padrão?  
  **R:** Substituir a imagem no post atual, mantendo a versão original preservada na biblioteca de mídias da organização.
- **Q:** Onde os pontos de entrada do editor visual devem estar posicionados no Postiz Web?  
  **R:** Em ambos os locais: no botão "Design Media" da área de uploads e via ícone "Editar Arte" sobre miniaturas já anexadas.

## 10. Lacunas

Nenhuma lacuna ou dúvida pendente. Requisitos 100% esclarecidos e prontos para planejamento.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-10-15 | Resolução das 3 dúvidas e integração dos esclarecimentos por `/reversa-clarify` | reversa |
