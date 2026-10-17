# Requisitos: Gestão de Kits de Marca & Presets Visuais (Brand Kits & Presets)

> Identificador: `020-hupflow-brand-kits-presets`  
> Data de início: `2026-10-16`  
> Cenário: `greenfield` (Clean-Room HupFlow)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/02-visual-canvas.md`, `_reversa_sdd/postiz-backend-api/contracts.md`)  

---

## 1. Visão Geral e Propósito

Esta feature entrega o subsistema de **Kits de Marca & Presets Visuais (Brand Kits)** do HupFlow.
Em agências de marketing e marcas digitais, a consistência visual entre carrosséis, posts e PDFs para LinkedIn é crucial.
O Brand Kit permite que a organização cadastre e gerencie uma ou mais identidades visuais:
1. **Paleta de Cores Institucional**: Cor Primária, Secundária, Acento/Destaque, Fundo e Texto.
2. **Tipografia de Marca**: Fonte dos Títulos (Heading) e Fonte do Corpo (Body Text) dentre fontes seguras e webfonts populares (Inter, Plus Jakarta Sans, Outfit, Roboto, Merriweather, JetBrains Mono).
3. **Ativos Institucionais**: Logotipo oficial (URL de imagem da Biblioteca de Mídia), `@handle` de autor (ex: `@hupflow`) e website/domínio.
4. **Aplicação Imediata no Canvas 2D**: No Estúdio de Carrosséis (`/studio`), o usuário pode selecionar o Brand Kit ativo com 1 clique, atualizando instantaneamente as cores do canvas, os rodapés com `@handle`, os contrastes e os contrastes acessíveis.
5. **Brand Kit Padrão**: Toda organização possui um Brand Kit padrão que alimenta novas criações automáticas geradas pela IA.

---

## 2. Requisitos Funcionais (RF)

- **RF-01 (Tabela brand_kits)**: Criar tabela `brand_kits` no Drizzle ORM associada ao `organizationId` com integridade referencial em cascata.
- **RF-02 (Definição de Presets Canônicos)**: Fornecer 5 presets de estilo corporativo de fábrica (Modern Dark, Minimalist Light, Neo Purple, Cyber Emerald, Warm Corporate) para onboarding imediato.
- **RF-03 (API REST /api/brand-kits)**:
  - `GET`: lista os Brand Kits da organização, destacando o kit padrão (`isDefault`).
  - `POST`: cria novo Brand Kit com validação de formato hexadecimal de cores e tipografia.
  - `PUT`: atualiza dados ou define um kit como padrão (`isDefault: true`).
  - `DELETE`: remove um Brand Kit (impedindo a exclusão do último kit restante).
- **RF-04 (Integração com Canvas 2D & Estúdio)**: Atualizar `studio/page.tsx` para carregar os Brand Kits da organização e disponibilizar um seletor visual na barra lateral do estúdio, aplicando a paleta e handle em tempo real nos slides do carrossel.
- **RF-05 (Painel de Gestão /settings/brand)**: Tela dedicada em `/settings/brand` com visualização de cartões de identidade visual, editor de cores interativo, seletor de fontes e indicador de contraste.

---

## 3. Requisitos Não Funcionais (RNF)

- **RNF-01 (Validação de Cores Hex)**: Todas as cores da paleta devem ser validadas contra o padrão `#RRGGBB` ou `#RGB`.
- **RNF-02 (Isolamento Multi-Tenant)**: Nenhum workspace pode visualizar, alterar ou excluir Brand Kits de outra organização.
- **RNF-03 (Fallback Offline/Dev)**: Caso o banco de dados esteja offline, a API deve fornecer kits padrão em memória para garantir que o estúdio nunca fique sem presets visuais.

---

## 4. Regras de Negócio (RN)

- **RN-01**: Toda organização deve ter exatamente um Brand Kit marcado como `isDefault: true`. Ao marcar um kit como padrão, os demais devem automaticamente ser desmarcados.
- **RN-02**: Apenas usuários com papel `member`, `admin` ou `owner` podem criar ou editar Brand Kits.
- **RN-03**: A exclusão do Brand Kit padrão só é permitida se houver outro kit disponível para herdar o status de padrão.

---

## 5. Rastreabilidade com SDD & Legado

- **SDD**: `_reversa_sdd/sdd/02-visual-canvas.md` (Camada Visual & Paletas).
- **Contratos**: `_reversa_sdd/postiz-backend-api/contracts.md#brand-kits`.
