import { ScheduleSlot } from './types';

export const DAYS_NAMES = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

/**
 * Projeta uma sequência contínua de slots de agendamento futuro
 * distribuídos estritamente nos dias da semana e horários solicitados.
 */
export function calculateScheduleSlots(
  startDate: Date = new Date(),
  daysOfWeek: number[] = [2, 4], // Terça e Quinta por padrão
  timeSlot: string = '10:00',
  count: number = 4
): ScheduleSlot[] {
  if (count <= 0) return [];

  const [hoursStr, minutesStr] = timeSlot.split(':');
  const targetHours = parseInt(hoursStr || '10', 10);
  const targetMinutes = parseInt(minutesStr || '0', 10);

  // Normaliza dias da semana para conjunto único e válido (0 a 6)
  const allowedDays = Array.from(
    new Set(daysOfWeek.filter((d) => d >= 0 && d <= 6))
  );
  const safeDays = allowedDays.length > 0 ? allowedDays : [2, 4];

  const now = new Date();
  const current = new Date(startDate);
  current.setHours(targetHours, targetMinutes, 0, 0);

  // Se o horário de hoje já passou, começa a busca a partir de amanhã
  if (current.getTime() <= now.getTime()) {
    current.setDate(current.getDate() + 1);
  }

  const slots: ScheduleSlot[] = [];
  let safetyCounter = 0;
  const maxIterations = 365; // Limite de 1 ano para evitar loops

  while (slots.length < count && safetyCounter < maxIterations) {
    const dayOfWeek = current.getDay();

    if (safeDays.includes(dayOfWeek)) {
      slots.push({
        date: new Date(current),
        dayOfWeek,
        dayOfWeekName: DAYS_NAMES[dayOfWeek],
        timeFormatted: timeSlot,
      });
    }

    current.setDate(current.getDate() + 1);
    safetyCounter++;
  }

  return slots;
}
