# Investigação Técnica: Fallback para BYOK no Carousel Generator

> Feature: `002-byok-fallback`  
> Data: `2026-10-14`  

## 1. Contexto dos Formulários

Ambos os formulários `AIInputForm` e `AITextAreaForm` já importam `generateCarouselSlides` de `@/lib/langchain` e `useKeysContext` de `@/lib/providers/keys-context`:

```tsx
import { generateCarouselSlides } from "@/lib/langchain";
import { useKeysContext } from "@/lib/providers/keys-context";
```

Em ambos os arquivos, o autor original havia deixado o comentário:
```tsx
// TODO: Restore local function for going over limit
// const generatedSlides = await generateCarouselSlides(
//   `...`,
//   apiKey
// );
```

## 2. Padrão de Execução de Fallback

Quando a Server Action retorna:
```ts
if (result.success) {
  setValue("slides", result.slides);
  toast({ title: "New carousel generated" });
} else if ((result.reason === "rate_limit" || result.reason === "missing_key") && apiKey) {
  // Aciona fallback com chave própria
  try {
    const localSlides = await generateCarouselSlides(prompt, apiKey);
    if (localSlides) {
      setValue("slides", localSlides);
      toast({
        title: "Carrossel gerado com sucesso!",
        description: "Utilizada sua chave própria da OpenAI (BYOK) devido ao limite da cota pública.",
      });
      return;
    }
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Falha na geração com chave própria",
      description: err instanceof Error ? err.message : "Verifique se sua chave OpenAI é válida.",
    });
  }
} else if (result.reason === "rate_limit") {
  // Limite atingido e sem chave configurada: instrui sobre BYOK
  const minutes = result.reset ? Math.max(1, Math.ceil((result.reset - Date.now()) / 60000)) : 15;
  toast({
    variant: "destructive",
    title: "Limite de requisições atingido",
    description: `Aguarde ${minutes} minuto(s) ou adicione sua chave de API OpenAI nas configurações para continuar sem limites.`,
  });
}
```

Essa solução fecha o ciclo do rate limit de forma elegante e amigável.
