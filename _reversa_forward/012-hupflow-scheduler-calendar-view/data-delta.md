# Data Delta: Visão de Calendário & Agendamentos

> Feature: `012-hupflow-scheduler-calendar-view`  
> Data: `2026-10-15`  

---

## 1. Resumo das Mudanças

Não há mudanças estruturais de schema no banco de dados. A funcionalidade consome os registros existentes da tabela `posts`:
- `scheduled_at`: Campo de data e hora utilizado para posicionar o card na coluna do dia correspondente da semana.
- `status`: Identifica se o job está pendente (`scheduled`), em processamento (`publishing`) ou concluído (`published`).

## 2. Tipagem do Item de Post do Calendário

```typescript
export interface CalendarPostItem {
  id: string;
  topic: string;
  preview: string;
  scheduledAt: Date;
  networks: ('linkedin' | 'x' | 'instagram' | 'threads')[];
  status: 'scheduled' | 'publishing' | 'published' | 'failed';
}
```
