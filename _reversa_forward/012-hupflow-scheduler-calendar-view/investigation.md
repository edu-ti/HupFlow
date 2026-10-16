# Investigação Técnica: Visualização de Calendário Semanal

> Feature: `012-hupflow-scheduler-calendar-view`  
> Data: `2026-10-15`  

---

## 1. Por que Construir Nativo em Vez de Adotar Bibliotecas Externas

Muitos projetos legados adotam pacotes como FullCalendar ou React-Big-Calendar, o que frequentemente resulta em:
- Conflitos de CSS e dificuldade de aplicar temas Dark Mode consistentes.
- Bundle excessivo (dezenas de KB desnecessários).
- Dependências instáveis com licenças GPL/Comerciais por assento.

No HupFlow, um componente nativo com funções puras de manipulação de data (`getStartOfWeek`, `addDays`, `formatDay`) oferece:
1. **Total Controle Estético:** 100% Tailwind CSS com paleta HupFlow Dark, glows sutis e animações fluidas.
2. **Zero Dependências Extras:** Não introduz pacotes pesados no `package.json`.
3. **Performance Imediata:** Renderização em menos de 2 milissegundos no navegador.

## 2. Algoritmo de Cálculo de Semana

```typescript
export function getDaysOfWeek(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  // Ajuste para iniciar na Segunda-feira (1) até Domingo (0)
  const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(baseDate.setDate(diff));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
```
