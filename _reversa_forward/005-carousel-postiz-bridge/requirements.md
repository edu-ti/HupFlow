# Requirements: Ponte Carousel Generator ➔ Postiz Web

> Identificador: `005-carousel-postiz-bridge`  
> Data: `2026-10-15`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

## 1. Resumo executivo

Esta feature estabelece a integração direta entre o gerador de carrosséis (**Carousel Generator**) e a plataforma de publicação social (**Postiz Web**). Ela permite que criadores de conteúdo e times de marketing enviem carrosséis gerados por inteligência artificial (em PDF para LinkedIn ou pacote de imagens para Instagram/Twitter) diretamente para a biblioteca de mídia e agendamento do Postiz com um clique, eliminando o atrito de download e upload manuais no ecossistema HupFlow.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura` | Carousel Generator (Next.js 14) e Postiz (Next.js 16 / NestJS 11) coexistem como pilares desacoplados no monorepo HupFlow. | 🟢 |
| `_reversa_sdd/domain.md#11-domínio-postiz-gestão-e-distribuição-social` | Definição de Organização multi-tenant, Post e Mídia no Postiz. | 🟢 |
| `_reversa_sdd/domain.md#13-domínio-carousel-generator-carrosséis-sociais-via-ia` | Estrutura de Slides, formatação de carrosséis e regras de renderização visual. | 🟢 |
| `_reversa_sdd/code-analysis.md#21-módulo-carousel-generator` | Fluxo de geração e exportação de slides via `html-to-image` e `jsPDF` em `use-component-printer.tsx` e `editor-menubar.tsx`. | 🟢 |
| `_reversa_sdd/code-analysis.md#24-módulo-postiz-backend-api` | Endpoint `POST /media/upload-simple` aceita uploads multipart e associa à organização informada no cabeçalho `auth`. | 🟢 |
| `_reversa_sdd/addenda/004-polotno-postiz-bridge.md#resumo-da-entrega` | Padrão arquitetural consolidado na feature 004 para envio multipart em memória para o Postiz. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Criador de Conteúdo / Social Media | Gerar carrossel via IA e publicá-lo rapidamente no LinkedIn ou Instagram sem sair do fluxo de trabalho. | Após gerar e revisar o carrossel no Carousel Generator, o usuário clica em "Exportar para Postiz", escolhe o formato (PDF ou PNGs) e os criativos são enviados para sua organização no Postiz com link para criar o post. |
| Agência / Equipe de Marketing | Centralizar a esteira de ativos de design na biblioteca do Postiz para revisão prévia e agendamento por múltiplos colaboradores. | O redator finaliza o conteúdo visual e despacha a peça diretamente para a biblioteca de mídias compartilhada do time no Postiz. |

## 4. Regras de negócio novas ou alteradas

1. **RN-CAROUSEL-01: Exportação e Envio Flexível ao Postiz** 🟢
   - Origem no legado: `carousel-generator-main/src/components/editor-menubar.tsx` e `_reversa_sdd/addenda/004-polotno-postiz-bridge.md`
   - Tipo: nova
   - Descrição: O Carousel Generator disponibiliza uma ação "Enviar para Postiz" com seletor flexível de formato, permitindo ao usuário exportar como documento PDF único (ideal para LinkedIn) ou como pacote de imagens individuais PNG (ideal para Instagram/X).

2. **RN-CAROUSEL-02: Autenticação e Vínculo Multi-tenant** 🟢
   - Origem no legado: `postiz-app-main/apps/backend/src/services/auth/auth.middleware.ts`
   - Tipo: preservada
   - Descrição: As requisições de upload para o Postiz devem enviar o cabeçalho `auth` com o token de sessão/API do usuário, garantindo que o arquivo pertença estritamente à organização ativa.

3. **RN-CAROUSEL-03: Resiliência e Feedback Amigável com Redirecionamento** 🟢
   - Origem no legado: `carousel-generator-main/src/app/actions.tsx`
   - Tipo: nova
   - Descrição: Após a conclusão do upload na biblioteca de mídia, o sistema exibe notificação Toast contendo botão/link direto "Criar Post no Postiz", facilitando o início imediato do agendamento social. Em caso de erro de rede ou token inválido, mensagens claras instruem a reconfiguração.

4. **RN-CAROUSEL-04: Proxy de Upload via Server Action** 🟢
   - Origem no legado: `carousel-generator-main/src/app/actions.tsx`
   - Tipo: nova
   - Descrição: A transmissão do arquivo para o Postiz é intermediada por uma Server Action no Next.js (`uploadToPostizAction`), eliminando vulnerabilidades de CORS no cliente e isolando o tráfego HTTP no backend.

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Ação "Enviar para o Postiz" no menu do Carousel Generator | Must | Botão / item de menu integrado a `editor-menubar.tsx` que abre o diálogo de exportação para o Postiz. | 🟢 |
| RF-02 | Modal de Configuração de Conexão com o Postiz | Must | Diálogo permitindo configurar a URL da API do Postiz (`apiUrl`) e o token de autenticação (`auth`), com salvamento persistido em `localStorage`. | 🟢 |
| RF-03 | Renderização e Conversão de Slides em Formatos Válidos | Must | Capacidade de converter os slides da prancheta em documento PDF (otimizado para LinkedIn) ou conjunto de imagens PNG de alta resolução. | 🟢 |
| RF-04 | Upload Multipart Direto via Server Action Proxy | Must | Server Action `uploadToPostizAction` que recebe o FormData e repassa para `/media/upload-simple` com cabeçalho `auth: <token>`, retornando os metadados da mídia salva. | 🟢 |
| RF-05 | Notificação e Link Direto para o Postiz | Must | Exibição de toast de sucesso com link ou botão para "Criar Post no Postiz" abrindo o Postiz Web. | 🟢 |
| RF-06 | Seletor de Formato no Diálogo (PDF vs Imagens PNG) | Must | Campo de seleção permitindo alternar entre PDF de documento ou imagens individuais PNG antes de disparar o upload. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Processamento em memória | Geração do PDF/imagens e upload em buffers sem resíduos em disco local. | 🟢 |
| Usabilidade | Feedback progressivo | Exibição de spinner/barra de status durante a renderização e o envio dos arquivos. | 🟢 |
| Segurança | Proteção de credenciais | Tokens configurados no Carousel Generator trafegam protegidos via Server Action sem exposição pública. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Envio bem-sucedido de carrossel PDF para o Postiz
  Dado que o usuário possui um carrossel com 5 slides gerados no Carousel Generator
  E configurou a API URL e o Token do Postiz válidos
  Quando selecionar o formato PDF no modal e clicar em "Confirmar e Enviar"
  Então o sistema renderiza o PDF em memória
  E despacha via Server Action para o endpoint /media/upload-simple no Postiz
  E exibe um toast de sucesso com botão "Criar Post no Postiz" apontando para a aplicação web do Postiz

Cenário: Envio de sequência de imagens individuais PNG
  Dado que o usuário selecionou o formato "Imagens PNG" no modal
  Quando confirmar o envio
  Então cada slide é renderizado em imagem PNG de alta resolução
  E todas as lâminas são enviadas para a biblioteca do Postiz
  E uma notificação confirma que os criativos foram adicionados à organização

Cenário: Tentativa de envio com token do Postiz inválido ou ausente
  Dado que o token configurado é inválido ou expirou
  Quando o usuário tentar enviar o carrossel
  Então o sistema captura a resposta HTTP 401/403
  E exibe um alerta orientando o usuário a verificar o token de autenticação nas configurações
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (Menu item de integração) | Must | Ponto de entrada visual indispensável para o usuário. |
| RF-02 (Modal de credenciais e URL) | Must | Necessário para viabilizar autenticação e comunicação com a API do Postiz. |
| RF-03 (Renderização de slides em memória) | Must | Mecanismo de geração dos arquivos que serão transferidos. |
| RF-04 (Upload multipart via Server Action) | Must | Núcleo da funcionalidade de interoperabilidade resiliente. |
| RF-05 (Toast com link para Postiz) | Must | Decidido no clarify como retorno padrão para fechamento do fluxo. |
| RF-06 (Seletor PDF vs PNG) | Must | Decidido no clarify para suportar tanto LinkedIn quanto Instagram. |

## 9. Esclarecimentos

### Sessão 2026-10-15
- **Q:** Qual deve ser o formato de envio dos slides para o Postiz?  
  **R:** Seletor flexível no diálogo permitindo ao usuário escolher entre documento PDF (LinkedIn) ou imagens PNG individuais (Instagram/Twitter).
- **Q:** Qual deve ser o comportamento do sistema após a conclusão do upload?  
  **R:** Salvar na Biblioteca de Mídias e exibir Toast informativo com link/botão para "Criar Post no Postiz" direcionando para a tela do Postiz Web.
- **Q:** Como deve ser estruturado o roteamento de rede para o upload?  
  **R:** Server Action no Next.js (`uploadToPostizAction`), atuando como proxy seguro no backend para evitar bloqueios de CORS e garantir resiliência de upload.

## 10. Lacunas

Nenhuma lacuna ou dúvida pendente. Requisitos 100% esclarecidos e validados para planejamento.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-10-15 | Resolução das 3 dúvidas e integração dos esclarecimentos por `/reversa-clarify` | reversa |
