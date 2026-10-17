# Investigation: Gestão de Identidade Visual & Integração com Canvas 2D

> Identificador: `020-hupflow-brand-kits-presets`  
> Data: `2026-10-16`  

---

## 1. Conexão entre Brand Kits e Canvas 2D

No HupFlow, o Canvas 2D do Estúdio (`renderSlideToCanvas` e `exportCarouselToPdf`) opera com o objeto `ColorPalette`:
```ts
export interface ColorPalette {
  background: string;
  primaryText: string;
  accentColor: string;
}
```
Um Brand Kit corporativo completo estende esse modelo para incluir:
- **`primary`**: Cor predominante dos títulos e cartões.
- **`secondary`**: Cor secundária de apoio e divisores.
- **`accent`**: Cor de destaque de botões, setas e números.
- **`background`**: Fundo do canvas (escuro ou claro).
- **`text`**: Cor legível do corpo de texto.
- **`handle`**: `@perfil` ou nome do autor renderizado no rodapé de cada slide.
- **`logoUrl`**: Logotipo exibido discretamente no topo ou canto inferior.

Ao alternar de Brand Kit no Estúdio, uma função adaptadora `brandColorsToCanvasPalette(colors)` converte o kit diretamente no formato consumido pelo renderizador nativo, permitindo visualização instantânea no canvas com 60 FPS.

---

## 2. Presets de Fábrica

Para usuários que ainda não têm um manual de identidade visual pronto, oferecemos 5 kits curados:
1. **Modern Dark (Padrão HupFlow)**: Fundo `#0B0F17`, Texto `#F8FAFC`, Acento `#6366F1` (Indigo).
2. **Neo Purple (Criadores Modernos)**: Fundo `#0F0C20`, Texto `#F5F3FF`, Acento `#A855F7` (Purple).
3. **Cyber Emerald (Tech & Startups)**: Fundo `#061412`, Texto `#ECFDF5`, Acento `#10B981` (Emerald).
4. **Clean Minimalist (Light Mode)**: Fundo `#FFFFFF`, Texto `#0F172A`, Acento `#2563EB` (Royal Blue).
5. **Warm Corporate (Executivos & Finanças)**: Fundo `#121214`, Texto `#F4F4F5`, Acento `#F59E0B` (Amber).

---

## 3. Conformidade Clean-Room

- Sem bibliotecas externas pesadas de color picker ou fontes proprietárias.
- Armazenamento em JSON estruturado com validação Zod.
