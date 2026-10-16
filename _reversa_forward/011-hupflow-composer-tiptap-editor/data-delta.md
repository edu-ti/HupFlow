# Data Delta: Editor TipTap & Preview Multicanal

> Feature: `011-hupflow-composer-tiptap-editor`  
> Data: `2026-10-15`  

---

## 1. Resumo das Mudanças

Não há mudanças estruturais de schema no banco de dados. O modelo `posts` do Drizzle ORM já armazena:
- `content`: Texto consolidado com quebras de parágrafo.
- `mediaIds`: Lista JSON de identificadores de mídias anexadas.
- `postChannels`: Customizações e sobrescritas de conteúdo adaptadas por rede social.

## 2. Tipagem de Mídias Anexadas na Interface

```typescript
export interface AttachedMedia {
  id: string;
  url: string;
  type: 'image' | 'pdf' | 'carousel';
  fileName: string;
  previewUrl?: string;
  slideCount?: number;
}
```
