# Contrato de Interface: Server Action `generateCarouselSlidesAction`

> Feature: `001-rate-limit-feedback`  
> Contrato: Next.js Server Action RPC  
> Localização: `carousel-generator-main/src/app/actions.tsx`  

## 1. Assinatura do Método

```ts
export async function generateCarouselSlidesAction(
  userPrompt: string
): Promise<GenerateCarouselResult>
```

## 2. Tipagem dos Parâmetros e Retorno

```ts
export type GenerateCarouselSuccess = {
  success: true;
  slides: UnstyledDocument;
};

export type GenerateCarouselError = {
  success: false;
  reason: "rate_limit" | "missing_key" | "error";
  message: string;
  reset?: number;     // Timestamp Unix em milissegundos (presente se reason === "rate_limit")
  remaining?: number; // Contagem restante (0 se rate_limit)
};

export type GenerateCarouselResult =
  | GenerateCarouselSuccess
  | GenerateCarouselError;
```

## 3. Respostas Mapeadas

| Situação | Status | `reason` | Payload Adicional |
|----------|--------|----------|-------------------|
| Sucesso na geração | `success: true` | n/a | `slides: UnstyledDocument` |
| Cota excedida no Upstash | `success: false` | `"rate_limit"` | `reset`, `remaining: 0`, mensagem explicativa |
| `OPENAI_API_KEY` ausente | `success: false` | `"missing_key"` | mensagem explicativa |
| Exceção interna / parse inválido | `success: false` | `"error"` | mensagem amigável |
