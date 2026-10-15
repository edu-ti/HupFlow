# Contrato de Interface: Fallback Client-side BYOK

> Feature: `002-byok-fallback`  
> Localização: `carousel-generator-main/src/lib/langchain.ts`  

## 1. Assinatura do Cliente Local

```ts
export async function generateCarouselSlides(
  topicPrompt: string,
  apiKey: string
): Promise<z.infer<typeof MultiSlideSchema> | null>
```

## 2. Fluxo de Decisão no Cliente

```mermaid
flowchart TD
    Submit([Submissão do Formulário]) --> CallAction[Chamar Server Action generateCarouselSlidesAction]
    CallAction --> CheckResult{Resultado da Action}
    
    CheckResult -->|success: true| RenderSlides[Popular Slides no Editor + Toast Sucesso]
    
    CheckResult -->|rate_limit / missing_key| CheckKey{Possui apiKey no KeysContext?}
    
    CheckKey -->|Sim| CallLocal[Executar generateCarouselSlides client-side com apiKey]
    CallLocal --> LocalSuccess{Sucesso local?}
    LocalSuccess -->|Sim| RenderBYOK[Popular Slides + Toast BYOK Informativo]
    LocalSuccess -->|Não| ToastKeyError[Toast Erro: Chave Inválida / Falha OpenAI]
    
    CheckKey -->|Não| ToastCooldown[Toast Aviso: Limite de cota + Sugestão de cadastrar chave]
    
    CheckResult -->|error| ToastGeneric[Toast Erro Genérico]
```
