# Onboarding / Validação: Gestão de Rate Limit no Carousel Generator

> Feature: `001-rate-limit-feedback`  
> Data: `2026-10-14`  

## 1. Pré-requisitos

1. Navegar até a pasta `carousel-generator-main`.
2. Ter o Node.js 18+ instalado.
3. Se for testar o Upstash KV localmente, configurar no arquivo `.env`:
   ```env
   OPENAI_API_KEY=sk-...
   KV_REST_API_URL=https://...
   KV_REST_API_TOKEN=...
   ```

## 2. Passo a Passo de Teste Manual

### Cenário 1: Limite de Requisições Atingido
1. Inicie a aplicação: `npm run dev` (porta 3000 ou 3001).
2. Acesse a tela principal do Carousel Generator no navegador.
3. Submeta 10 prompts consecutivos no campo de tema ou artigo até consumir a cota de 15 minutos.
4. Na 11ª submissão:
   - Verifique se a aplicação não quebra.
   - Verifique se surge um Toast vermelho de erro alertando: *"Limite de requisições atingido. Você atingiu o limite de gerações. Tente novamente em aproximadamente X minuto(s)."*
   - Verifique se o editor não apaga os slides atuais e se o botão volta ao estado pronto.

### Cenário 2: Ausência de Chave OpenAI
1. Em um ambiente de teste sem `OPENAI_API_KEY`:
2. Submeta um prompt.
3. Verifique se o Toast exibe mensagem explícita informando a ausência da chave, em vez de falha genérica desconhecida.
