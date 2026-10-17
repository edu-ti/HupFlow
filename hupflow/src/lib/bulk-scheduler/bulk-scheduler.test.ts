import assert from 'assert';
import { calculateScheduleSlots, DAYS_NAMES } from './slots';
import { checkResourceQuota } from '@/lib/billing/plans';

async function runTests() {
  console.log('[TEST] Iniciando testes do motor de agendamento em lote (AI Bulk Scheduler)...');

  // 1. Projeção de slots para Terças (2) e Quintas (4)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const slots = calculateScheduleSlots(tomorrow, [2, 4], '14:30', 6);
  assert.strictEqual(slots.length, 6, 'Deve gerar exatamente 6 slots');

  const now = new Date();
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    assert(s.date.getTime() > now.getTime(), `O slot ${i + 1} deve estar no futuro`);
    assert(s.dayOfWeek === 2 || s.dayOfWeek === 4, `Dia da semana deve ser 2 ou 4 (recebido: ${s.dayOfWeek})`);
    assert.strictEqual(s.date.getHours(), 14, 'Horário deve ser 14h');
    assert.strictEqual(s.date.getMinutes(), 30, 'Minutos devem ser 30m');
    assert.strictEqual(s.dayOfWeekName, DAYS_NAMES[s.dayOfWeek]);

    if (i > 0) {
      assert(s.date.getTime() > slots[i - 1].date.getTime(), 'Slots devem ser estritamente cronológicos e crescentes');
    }
  }
  console.log('✅ Projeção de slots temporais validada com sucesso.');

  // 2. Projeção com dia único (ex: Segundas às 09:00)
  const mondaySlots = calculateScheduleSlots(tomorrow, [1], '09:00', 4);
  assert.strictEqual(mondaySlots.length, 4);
  mondaySlots.forEach((slot) => {
    assert.strictEqual(slot.dayOfWeek, 1);
    assert.strictEqual(slot.dayOfWeekName, 'Segunda-feira');
    assert.strictEqual(slot.date.getHours(), 9);
    assert.strictEqual(slot.date.getMinutes(), 0);
  });
  console.log('✅ Projeção de dia único semanal aprovada.');

  // 3. Validação de Cotas de Posts Mensais (Feature 017 Integration)
  // Plano Starter possui limite de 30 posts no mês
  const quotaOk = checkResourceQuota('starter', 'postsThisMonth', 24);
  assert.strictEqual(quotaOk.allowed, true, '24 posts devem ser permitidos no Starter');

  const quotaExceeded = checkResourceQuota('starter', 'postsThisMonth', 30);
  assert.strictEqual(quotaExceeded.allowed, false, '30 posts devem atingir o teto do Starter');
  assert(quotaExceeded.reason?.includes('atingiu o limite de 30'), 'Motivo da cota deve ser claro');

  // Plano Pro possui posts ilimitados (-1)
  const proQuota = checkResourceQuota('pro', 'postsThisMonth', 500);
  assert.strictEqual(proQuota.allowed, true, 'Plano Pro deve permitir posts ilimitados');
  assert.strictEqual(proQuota.limit, -1);
  console.log('✅ Validação de cotas de campanhas em lote aprovada.');

  console.log('✅ Todos os testes do AI Bulk Scheduler passaram com 100% de sucesso!');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Falha nos testes de bulk scheduler:', err);
  process.exit(1);
});
