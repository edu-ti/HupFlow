# Requirements: AI Copywriter & Sugestão de Legendas no Postiz

> Feature: `007-ai-copywriter`  
> Data: `2026-10-15`  
> Status: `Approved`  
> Origem: Ordem de evolução solicitada pelo usuário (Item 2: AI Copywriter & Sugestão de Legendas)

---

## 1. Contexto e Problema de Negócio

No ecossistema HupFlow / Postiz, o usuário cria e agenda postagens para múltiplas redes sociais (LinkedIn, X/Twitter, Instagram, Facebook, Threads, etc.) dentro do modal de composição (`manage.modal.tsx` / `editor.tsx`). 

Atualmente:
1. O usuário precisa redigir todo o texto manualmente ou depender de ferramentas externas de IA.
2. Embora o Postiz possua integrações base com OpenAI e `@copilotkit`, o `CopilotPopup` flutuante no canto do modal continha instruções desatualizadas que referenciavam funções inexistentes (`addPostContentFor`), sem prover assistência ágil e visual na barra de edição.
3. Não havia uma interface nativa focada em **Copywriting Especializado por Rede Social**:
   - Cada rede social exige estrutura e densidade distintas (ex: ganchos provocativos no X com restrição de caracteres; quebras de linha com lições profissionais no LinkedIn; ganchos visuais e hashtags estratégicas no Instagram).
   - O criador de conteúdo perde tempo formatando e adaptando a mesma mensagem para cada plataforma.

---

## 2. Objetivos e Escopo

### 2.1 Objetivos Principais
- **Assistência de Copywriting Integrada**: Prover um modal/assistente especializado "AI Copywriter" acessível com 1 clique diretamente na área de edição de posts.
- **Adaptação por Plataforma**: Ajustar tom, estilo, tamanho e estrutura conforme o canal ativo (LinkedIn, X, Instagram, Facebook, Threads ou Multicanal).
- **Gerador de Ganchos (Hooks)**: Fornecer variações alternativas de abertura para maximizar a retenção nos primeiros segundos de leitura.
- **Sugestor de Hashtags**: Sugerir hashtags relevantes com badges clicáveis para inclusão imediata no post.
- **Melhoria Contextual**: Permitir gerar um post a partir de uma ideia nova OU refinar/melhorar o texto já escrito no editor com opções de tom (Profissional, Engajador, Casual, Persuasivo, Viral).
- **Aplicação Direta no Editor**: Inserir o texto resultante com substituição ou concatenação no editor TipTap ativo sem perda de formatação.

---

## 3. Requisitos Funcionais (RF)

| ID | Descrição | Prioridade |
|---|---|---|
| **RF-001** | Botão `✨ AI Copywriter` no editor de postagens com visual destacado e acessível em cada post da thread. | Alta |
| **RF-002** | Modal `AiCopywriterModal` com abas ou modos "💡 Nova Ideia" e "✍️ Melhorar Atual", pré-preenchido com o texto do post ativo. | Alta |
| **RF-003** | Seletores interativos de: **Rede Social Alvo** (detectando a rede ativa automaticamente) e **Tom de Voz** (Profissional, Engajador, Descontraído, Persuasivo, Viral). | Alta |
| **RF-004** | Ações de refinamento com 1 clique: Gerar Legenda Completa, Gerar 3 Ganchos (Hooks), Gerar Hashtags em Alta, Encurtar ou Expandir. | Alta |
| **RF-005** | Card de resultado com contador de caracteres, ganchos clicáveis para troca rápida de introdução e nuvem de hashtags clicáveis. | Alta |
| **RF-006** | Botões de ação final: "✨ Inserir no Post" (substitui no editor ativo), "➕ Anexar ao Post" e "📋 Copiar". | Alta |
| **RF-007** | Endpoint no backend NestJS (`POST /copilot/copywriter`) processando a requisição com OpenAI (`gpt-4.1` / `gpt-4o-mini`) e retorno estruturado JSON. | Alta |
| **RF-008** | Fallback gracioso no backend: caso a chave de API não esteja configurada ou ocorra timeout, retornar templates e variações inteligentes heurísticas para nunca deixar o usuário sem resposta. | Média |
| **RF-009** | Atualização do `CopilotPopup` com instruções alinhadas ao estado atual do Postiz (`setPosts` e canais). | Média |

---

## 4. Requisitos Não Funcionais (RNF)

- **RNF-001 (Compatibilidade)**: Manter total interoperabilidade com o editor TipTap, Zustand store (`useLaunchStore`) e instâncias multi-post.
- **RNF-002 (Segurança & Multi-Tenant)**: O endpoint do backend deve validar a organização do usuário via token e aplicar permissões RBAC de AI (`@CheckPolicies([AuthorizationActions.Create, Sections.AI])`).
- **RNF-003 (UX Premium)**: Interface moderna com feedback de carregamento animado, feedback via Toaster e transições suaves.
- **RNF-004 (I18n)**: Suporte a fallback de strings via `useT()`.

---

## 5. Critérios de Aceite

1. O botão "AI Copywriter" é visível na barra de ferramentas do editor de post no modal de criação.
2. Ao clicar, o modal abre carregando o texto atualmente digitado (se houver) e selecionando o provedor do canal ativo (ex: LinkedIn).
3. O usuário pode alternar tom e clicar em "Gerar Legenda", recebendo a legenda formatada, 3 opções de ganchos e hashtags sugeridas.
4. Clicar em um dos ganchos substitui a primeira frase da legenda gerada.
5. Clicar em "Inserir no Post" fecha o modal e atualiza o conteúdo do post ativo no editor.
