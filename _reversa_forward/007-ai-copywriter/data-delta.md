# Data Delta: AI Copywriter & Sugestão de Legendas no Postiz

> Feature: `007-ai-copywriter`  
> Data: `2026-10-15`  

---

## 1. Alterações de Banco de Dados / Prisma

- **Nenhuma alteração de schema Prisma necessária**. A geração de copywriting é stateless e operada em tempo de composição de postagens, salvando o texto final nos campos existentes de post (`content` da entidade `Post` do Prisma).

---

## 2. Contratos de API (Novos / Modificados)

### 2.1 Novo Endpoint: `POST /copilot/copywriter`

- **Headers**: `Content-Type: application/json`, Cookie de sessão / Bearer token
- **Request Body (`CopywriterDto`)**:
  ```json
  {
    "topic": "Lançamento da nova versão com foco em produtividade",
    "content": "Hoje lançamos algo muito legal...",
    "platform": "linkedin",
    "tone": "engaging",
    "mode": "caption",
    "customInstruction": "Adicionar menção a teste grátis"
  }
  ```
- **Campos**:
  - `topic` (string, opcional): Ideia principal para post novo.
  - `content` (string, opcional): Conteúdo existente a ser refinado.
  - `platform` (string, default `'generic'`): `'linkedin'` | `'x'` | `'instagram'` | `'facebook'` | `'threads'` | `'generic'`
  - `tone` (string, default `'engaging'`): `'engaging'` | `'professional'` | `'casual'` | `'persuasive'` | `'viral'`
  - `mode` (string, default `'caption'`): `'caption'` | `'hooks'` | `'hashtags'` | `'improve'`
  - `customInstruction` (string, opcional): Instrução livre do usuário.

- **Response Body**:
  ```json
  {
    "caption": "Texto completo gerado e formatado para a rede...",
    "hooks": [
      "Gancho alternativo 1",
      "Gancho alternativo 2",
      "Gancho alternativo 3"
    ],
    "hashtags": ["#produtividade", "#tecnologia", "#inovacao"],
    "platformTip": "No LinkedIn, posts com espaçamento claro e perguntas no final geram 3x mais engajamento."
  }
  ```
