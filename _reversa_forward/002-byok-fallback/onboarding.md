# Onboarding / Validação: Fallback BYOK no Carousel Generator

> Feature: `002-byok-fallback`  
> Data: `2026-10-14`  

## 1. Passo a Passo para Teste Manual

### Cenário 1: Fallback com Chave Própria
1. Inicie a aplicação: `npm run dev` em `carousel-generator-main`.
2. Abra o diálogo de chaves de API clicando no ícone correspondente na barra superior/footer.
3. Insira sua chave OpenAI válida (`sk-...`) e salve.
4. Esgote a cota de 10 gerações públicas ou force o retorno de rate limit no Upstash.
5. Ao submeter um novo carrossel:
   - A aplicação detecta a cota esgotada e executa `generateCarouselSlides` localmente via LangChain com sua chave.
   - O carrossel é populado no editor.
   - O Toast verde informa: *"Carrossel gerado com sucesso! Utilizada sua chave própria da OpenAI (BYOK) devido ao limite da cota pública."*

### Cenário 2: Sugestão de Chave Própria
1. Sem chave salva no diálogo, ao atingir o limite de cota:
2. O Toast destrutivo alerta sobre os minutos restantes e sugere adicionar a chave nas configurações para continuar sem restrições.
