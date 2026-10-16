import { getDaysOfWeek, isSameDay, formatWeekRange } from './date-utils';

function testCalendarUtils() {
  console.log('[TEST] Iniciando testes de date-utils...');

  // Teste 1: getDaysOfWeek sempre retorna 7 dias iniciando na Segunda
  const refDate = new Date(2026, 9, 15); // 15 de Outubro de 2026 (Quinta-feira)
  const week = getDaysOfWeek(refDate);

  if (week.length !== 7) {
    throw new Error(`Esperava 7 dias na semana, obteve ${week.length}`);
  }

  // O primeiro dia da semana deve ser Segunda-feira (getDay === 1)
  if (week[0].getDay() !== 1) {
    throw new Error(`Primeiro dia deveria ser Segunda-feira (1), obteve ${week[0].getDay()}`);
  }

  // O último dia da semana deve ser Domingo (getDay === 0)
  if (week[6].getDay() !== 0) {
    throw new Error(`Último dia deveria ser Domingo (0), obteve ${week[6].getDay()}`);
  }

  // Teste 2: isSameDay
  const d1 = new Date(2026, 9, 15, 10, 30);
  const d2 = new Date(2026, 9, 15, 18, 45);
  const d3 = new Date(2026, 9, 16, 10, 30);

  if (!isSameDay(d1, d2)) {
    throw new Error('Falha no isSameDay para mesmo dia com horários distintos');
  }

  if (isSameDay(d1, d3)) {
    throw new Error('Falha no isSameDay para dias diferentes');
  }

  // Teste 3: formatWeekRange
  const rangeStr = formatWeekRange(week);
  if (!rangeStr.includes('Outubro') || !rangeStr.includes('2026')) {
    throw new Error(`Falha no formatWeekRange: ${rangeStr}`);
  }

  console.log('✅ Todos os testes de date-utils passaram com 100% de sucesso!');
}

testCalendarUtils();
