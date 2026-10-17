# Pontos de Vigilância de Regressão: Recomendador de Hashtags com IA & Coleções Salvas

> Identificador da Feature: `028-hupflow-ai-hashtag-recommender`  
> Data: `2026-10-16`  
> Suite de Testes: `hupflow/src/lib/hashtags/hashtags.test.ts`  

---

## 1. Novos Pontos de Vigilância (W053 - W055)

### [W053] Resiliência Semântica e Fallback Offline sem Bloqueio de Thread
- **Risco**: Uma falha temporária ou timeout na API do provedor de IA (OpenAI) derrubar a experiência de redação no Compositor ou bloquear a submissão do post.
- **Detecção**: O método `recommendHashtags` encapsula a chamada de IA em bloco `try/catch` e aciona instantaneamente o motor semântico heurístico baseado no dicionário de nicho local.
- **Mitigação**: O subsistema garante tempo de resposta inferior a 50ms quando operando em modo fallback, assegurando funcionamento ininterrupto em qualquer ambiente.

### [W054] Formatação Canônica de Hashtags e Prevenção de Tags Inválidas
- **Risco**: A IA ou o usuário inserirem caracteres inválidos em hashtags (espaços internos, pontuações, acentos ou símbolos matemáticos), quebrando o parsing de tags nas APIs sociais e gerando rejeição na publicação.
- **Detecção**: A função `sanitizeTag` executa normalização Unicode NFD, remove acentos e caracteres não alfanuméricos, convertendo termos compostos em PascalCase limpo.
- **Mitigação**: A suíte de testes `hashtags.test.ts` valida exaustivamente strings com acentos, pontuações e delimitadores múltiplos.

### [W055] Alerta de Saturação Algorítmica por Rede Social
- **Risco**: Usuários inserirem números excessivos de hashtags no LinkedIn (onde mais de 5 tags reduz o alcance orgânico) ou no X (onde esgota os 280 caracteres).
- **Detecção**: O componente `HashtagRecommenderModal` e o serviço calculam a proporção entre tags selecionadas e `recommendedCount`, exibindo um indicador visual de saturação quando o limite saudável for ultrapassado.
- **Mitigação**: O `getNetworkGuidance` fornece as recomendações oficiais de cada algoritmo para orientar as decisões editoriais da equipe.
