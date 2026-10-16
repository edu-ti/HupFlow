# Requirements: Conectores Oficiais da Meta (Instagram & Threads)

> Identificador: `010-hupflow-instagram-threads-connectors`  
> Data: `2026-10-15`  
> Pasta de especificações SDD: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta feature implementa os conectores oficiais da Meta Graph API para Instagram (contas profissionais/criadores) e Threads API sob a interface padronizada `SocialConnector` do HupFlow. Ela viabiliza a autenticação segura via OAuth 2.0 PKCE, armazenamento criptografado dos tokens de longa duração via AES-256-GCM, publicação em dois passos da Meta (criação de container de mídia + publish) e suporte a posts de texto e imagem/carrossel.

---

## 2. Contexto a partir do legado e especificações SDD

| Fonte | Trecho relevante | Confidência |
|-------|------------------|:-----------:|
| `_reversa_sdd/sdd/06-social-connectors.md` | Interface abstrata unificada `SocialConnector` com `getAuthUrl`, `exchangeCode`, `refreshToken` e `publish`. | 🟢 |
| `_reversa_sdd/prd.md#escopo-mvp` | Conectores para redes sociais essenciais: LinkedIn, X, Instagram e Threads. | 🟢 |
| `hupflow/src/lib/connectors/encryption.ts` | Utilização mandatória de AES-256-GCM para criptografia de tokens em repouso. | 🟢 |
| `_reversa_sdd/architecture.md` | Independência de frameworks legados com implementação direta das APIs REST oficiais da Meta. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Mariana (Social Media Manager)** | Publicar a mesma campanha no LinkedIn e no Instagram com legenda ajustada para cada plataforma. | Redige o post no Compositor do HupFlow, seleciona LinkedIn e Instagram e o sistema orquestra o disparo simultâneo respeitando o fluxo de container da Meta. |
| **Lucas (Solopreneur)** | Compartilhar reflexões curtas e pensamentos rápidos na rede Threads diretamente do painel. | Seleciona o canal Threads, redige um texto informal de até 500 caracteres e o conector publica instantaneamente via Threads API. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Fluxo em Duas Etapas da Meta):** Para o Instagram, a publicação de imagens exige a criação prévia de um container de mídia (`POST /{ig-user-id}/media`) com `image_url` pública acessível e posterior publicação do container (`POST /{ig-user-id}/media_publish`). 🟢
2. **RN-02 (Criptografia Obrigatória dos Tokens):** Nenhum `accessToken` ou `refreshToken` da Meta pode ser gravado em texto puro no PostgreSQL. Todo token é encriptado via `encrypt()` antes da persistência. 🟢
3. **RN-03 (Tokens de Longa Duração - 60 Dias):** O fluxo de troca de código OAuth deve automaticamente trocar o token de curta duração pelo token de longa duração da Meta (`fb_exchange_token`) com validade padrão de 60 dias. 🟢
4. **RN-04 (Simulação Local em Dev):** Caso `INSTAGRAM_CLIENT_ID` ou `THREADS_CLIENT_ID` não estejam preenchidos no ambiente de desenvolvimento local, o conector deve operar em modo simulado seguro sem quebrar a inicialização da aplicação. 🟢
5. **RN-05 (Isolamento de Falha):** A falha em um canal da Meta (ex: token do Instagram expirado) não pode impactar o disparo nos outros canais selecionados (LinkedIn ou X). Cada canal atualiza seu status de forma independente em `post_channels`. 🟢

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|:----------:|--------------------|:-----------:|
| **RF-01** | Implementação da classe `InstagramConnector` compatível com a interface `SocialConnector`. | Must | A classe implementa `getAuthUrl`, `exchangeCode`, `refreshToken` e `publish`. | 🟢 |
| **RF-02** | Implementação da classe `ThreadsConnector` compatível com a interface `SocialConnector`. | Must | A classe implementa publicação de texto e link via Threads API oficial da Meta. | 🟢 |
| **RF-03** | Registro dos novos provedores no `getSocialConnector` em `connectors/index.ts`. | Must | `getSocialConnector('instagram')` e `getSocialConnector('threads')` retornam as instâncias adequadas sem erro. | 🟢 |
| **RF-04** | Integração com o Worker do BullMQ para consumo assíncrono. | Must | O worker processa posts direcionados a contas do Instagram e Threads chamando os novos conectores. | 🟢 |
| **RF-05** | Habilitação dos seletores visuais na página de Contas Conectadas e no Compositor. | Should | A interface permite ao usuário visualizar o status ativo e selecionar as redes para publicação. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|:-----------:|
| **Segurança** | Criptografia AES-256-GCM com chave derivada de 32 bytes e verificação de Auth Tag. | Proteção contra vazamento de credenciais em caso de dump do banco de dados. | 🟢 |
| **Resiliência** | Retentativas automáticas no BullMQ caso a Meta retorne erro transitório (código 500 ou 429). | Garantia de entrega com backoff exponencial configurado na fila. | 🟢 |
| **Conformidade de Licença** | Uso de chamadas HTTP nativas (`fetch`) sem SDKs externos proprietários de terceiros. | Arquitetura Clean-Room do HupFlow. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Publicação de post no Instagram via container
  Dado que o usuário agendou um post com imagem para a conta conectada do Instagram
  Quando o worker do BullMQ processa o job de agendamento
  Então o conector cria o container de mídia na Meta Graph API
  E aguarda o status de processamento ficar pronto
  E dispara o comando de publish no container
  E registra o externalPostId e status 'published' no post_channels

Cenário: Publicação de texto no Threads
  Dado que o usuário enviou um texto curto para a conta do Threads
  Quando o worker dispara a publicação
  Então o conector chama a API do Threads com o texto e o token descriptografado
  E atualiza o status do canal para 'published'

Cenário: Tentativa de publicação com token expirado
  Dado que o token da conta da Meta expirou e não pôde ser renovado
  Quando o conector tenta realizar a publicação
  Então o sistema captura a mensagem de erro amigável da Meta
  E marca o canal correspondente como 'failed' com a mensagem de erro detalhada
  E não impede a publicação bem-sucedida nos outros canais vinculados
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|:------:|---------------|
| RF-01 (Conector Instagram Graph API) | **Must** | Rede visual mais demandada pelos criadores de conteúdo. |
| RF-02 (Conector Threads API) | **Must** | Rede conversacional em rápida ascensão. |
| RF-03 (Registry de Conectores Centralizado) | **Must** | Permite despacho dinâmico no worker. |
| RF-04 (Integração com Worker BullMQ) | **Must** | Garante o agendamento no minuto exato. |
| RF-05 (UI de Contas e Compositor) | **Should** | Experiência visual completa para o usuário final. |

---

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

---

## 10. Lacunas

> Nenhuma lacuna crítica pendente. Contratos e APIs oficiais da Meta documentados em `_reversa_sdd/sdd/06-social-connectors.md`.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-requirements` para a Feature 010 | reversa-requirements |
