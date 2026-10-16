/**
 * Utilitários de manipulação de datas para o Calendário Semanal do HupFlow.
 */

export function getDaysOfWeek(baseDate: Date): Date[] {
  const current = new Date(baseDate);
  const day = current.getDay();
  // Ajuste para que a semana comece na Segunda-feira (1) até Domingo (0)
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(current.setDate(diff));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function formatDayName(d: Date): string {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[d.getDay()];
}

export function formatDayFullName(d: Date): string {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return days[d.getDay()];
}

export function formatWeekRange(dates: Date[]): string {
  if (!dates || dates.length === 0) return '';
  const first = dates[0];
  const last = dates[dates.length - 1];

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (first.getMonth() === last.getMonth()) {
    return `${first.getDate()} a ${last.getDate()} de ${months[first.getMonth()]}, ${first.getFullYear()}`;
  }

  return `${first.getDate()} de ${months[first.getMonth()]} a ${last.getDate()} de ${months[last.getMonth()]}, ${first.getFullYear()}`;
}
