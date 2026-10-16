# Data Delta: Estúdio de Carrosséis & Exportação

> Feature: `009-hupflow-studio-carousel`  
> Data: `2026-10-15`  

---

## 1. Resumo das Mudanças

A Feature 009 opera primariamente na camada de apresentação e compilação de mídia. Não requer modificações estruturais nas tabelas do PostgreSQL gerenciadas pelo Drizzle ORM (`schema.ts`).

## 2. Entidades Utilizadas

- **`posts`**: Quando o carrossel é enviado para o agendador, um registro é criado com `status: "draft"` e o conteúdo consolidado.
- **`media`**: Quando o carrossel em PDF é salvo para publicação em fila, ele é persistido com `mimeType: "application/pdf"`, dimensões e tamanho em bytes.

## 3. Estrutura de Estado Serializável do Slide (Client-side)

```typescript
export interface SlideState {
  slideNumber: number;
  type: 'cover' | 'content' | 'quote' | 'statistic' | 'cta';
  headline: string;
  bodyText: string;
  highlightText?: string;
  suggestedIcon?: string;
}

export interface CarouselDeckState {
  topic: string;
  targetAudience: string;
  aspectRatio: '1:1' | '4:5' | '9:16';
  colorPalette: {
    background: string;
    primaryText: string;
    accentColor: string;
  };
  slides: SlideState[];
}
```
