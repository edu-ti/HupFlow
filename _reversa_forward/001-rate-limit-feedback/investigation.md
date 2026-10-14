# Investigação Técnica: Gestão de Rate Limit no Carousel Generator

> Feature: `001-rate-limit-feedback`  
> Data: `2026-10-14`  

## 1. Contexto e Problema Original

Em `carousel-generator-main/src/app/actions.tsx:16-19`:
```tsx
    if (!rl.success) {
      // TODO: Handle returning errors
      return null;
    }
```
Quando o rate limit estoura (10 requisições a cada 15 minutos por IP no Upstash), a action retorna `null`.
Nos consumidores de frontend:
- `carousel-generator-main/src/components/ai-input-form.tsx`
- `carousel-generator-main/src/components/ai-textarea-form.tsx`

O código fazia apenas:
```tsx
    if (generatedSlides) {
      setValue("slides", generatedSlides);
      toast({ title: "New carousel generated" });
    } else {
      toast({ title: "Failed to generate carousel" });
    }
```
Isso causava uma experiência confusa ao usuário: a mensagem "Failed to generate carousel" não esclarece se o servidor caiu, se a OpenAI falhou ou se o usuário foi limitado por cota.

## 2. API do Upstash Ratelimit

O `@upstash/ratelimit` retorna o seguinte formato ao executar `limit(identifier)`:
```ts
{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp em ms do momento em que a cota é restaurada
  pending: Promise<unknown>;
}
```

## 3. Padrão de Resposta Proposto (Discriminated Union)

```ts
export type GenerateCarouselResult =
  | {
      success: true;
      slides: UnstyledDocument;
    }
  | {
      success: false;
      reason: "rate_limit";
      reset: number;
      remaining: number;
      message: string;
    }
  | {
      success: false;
      reason: "missing_key";
      message: string;
    }
  | {
      success: false;
      reason: "error";
      message: string;
    };
```

## 4. Apresentação no Frontend

Ao receber `success: false` com `reason === "rate_limit"`:
- Calcula o tempo restante: `const minutes = Math.max(1, Math.ceil((res.reset - Date.now()) / 60000));`
- Dispara `toast({ variant: "destructive", title: "Limite de requisições atingido", description: `Você atingiu o limite de gerações. Tente novamente em aproximadamente ${minutes} minuto(s).` });`
- Mantém o estado dos botões consistente.
