# Roadmap: Editor Polotno Canvas Embutido no Postiz Web

> Identificador: `006-polotno-web-canvas`  
> Data: `2026-10-15`  
> Requirements: `_reversa_forward/006-polotno-web-canvas/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

## 1. Resumo da abordagem

Esta evolução aprimora a integração do editor visual **Polotno** dentro do **Postiz Web**. A abordagem consiste em transformar o modal existente de design em uma ferramenta completa de criação e retoque para redes sociais:
1. Adicionar uma barra de presets com 4 proporções otimizadas (1:1 Quadrado, 16:9 Paisagem, 9:16 Vertical e 4:5 Retrato), acionando `store.setSize(width, height)`.
2. Habilitar o parâmetro `initialMedia` para carregar fotos existentes como elementos de fundo da prancheta.
3. Adicionar um botão de atalho "Editar Arte" sobre as miniaturas de mídias já anexadas na lista de uploads do editor de posts.
4. Desbloquear o acesso ao modal no método `designMedia`, removendo o gate exclusivo `user?.tier?.ai` para ferramentas essenciais de layout.
5. Permitir a substituição contextual da imagem no post atual ao salvar o resultado (`POST /media/upload-simple`).

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Usabilidade Fluida | Reduz passos operacionais permitindo retocar fotos e ajustar proporções diretamente no navegador. | respeita |
| Isolamento Multi-tenant | As novas mídias continuam salvas estritamente no escopo da organização do usuário. | respeita |
| Reuso de Código Existente | Aproveita o SDK do Polotno e folhas de estilo já presentes no monorepo do Postiz. | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Barra de botões de proporção (1:1, 16:9, 9:16, 4:5) no topo do modal | Cobre 98% dos casos de uso de redes sociais com 1 clique | Menus dropdown complexos ou campos manuais de pixels | 🟢 |
| D-02 | Inserção de `initialMedia` como elemento de imagem na prancheta | Permite sobrepor textos, logos, formas e adesivos sobre fotos existentes | Bloquear edição de mídias pré-existentes | 🟢 |
| D-03 | Acesso liberado no `designMedia` sem restrição rígida de assinatura | Democratiza ferramentas visuais básicas no Postiz; apenas geradores de imagem por IA continuam restritos ao plano Pro | Manter o editor bloqueado para planos Free | 🟢 |
| D-04 | Substituição contextual no post com preservação na biblioteca | Garante que o rascunho do post use a nova imagem retocada sem perder o histórico | Criar duplicatas no mesmo post ou sobrescrever o arquivo original em disco | 🟢 |

## 4. Premissas

Todas as dúvidas foram sanadas na fase de requisitos e esclarecimentos. Nenhuma premissa não confirmada permanece em aberto.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `Polonto` | `postiz-app-main/apps/frontend/src/components/launches/polonto.tsx` | regra-alterada | Adiciona barra de presets de tamanho e suporte a `initialMedia`. |
| `MediaComponent` | `postiz-app-main/apps/frontend/src/components/media/media.component.tsx` | regra-alterada | Desbloqueia `designMedia` e adiciona botão de retoque nas miniaturas. |

## 6. Delta no modelo de dados

- Resumo das mudanças: Nenhuma alteração no schema do Prisma; continua utilizando o modelo de `Media` existente.
- Detalhe completo em: `_reversa_forward/006-polotno-web-canvas/data-delta.md`

## 7. Delta de contratos externos

Nenhum contrato externo novo. Utiliza o endpoint `POST /media/upload-simple` já padronizado no Postiz Backend.

## 8. Plano de migração

Não aplicável (sem migrações de dados).

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Imagem original muito grande carregada no canvas | Médio | Baixa | O Polotno SDK redimensiona o elemento para os limites da página automaticamente |
| Troca de proporção após adicionar elementos | Baixo | Média | `store.setSize` preserva os elementos existentes no canvas |

## 10. Critério de pronto

- [ ] Barra de 4 presets sociais disponível no editor Polotno
- [ ] Abertura do editor permitida sem restrição de tier de IA
- [ ] Botão de editar presente em miniaturas de imagens anexadas
- [ ] Salvamento e substituição corretos da imagem no formulário de post

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-plan` | reversa |
