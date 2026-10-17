import assert from 'node:assert';
import { PLANS, getPlanConfig, checkResourceQuota } from './plans';

console.log('[TEST] Iniciando testes do motor de planos e cotas...');

// 1. Configurações de planos
assert.strictEqual(PLANS.starter.priceMonthly, 49);
assert.strictEqual(PLANS.pro.priceMonthly, 149);
assert.strictEqual(PLANS.agency.priceMonthly, 349);

assert.strictEqual(getPlanConfig('pro').id, 'pro');
assert.strictEqual(getPlanConfig(null).id, 'starter');
assert.strictEqual(getPlanConfig('inexistente').id, 'starter');

console.log('✅ Configurações de planos validadas.');

// 2. Validação de Cotas (Starter)
const quotaAccountsOk = checkResourceQuota('starter', 'socialAccounts', 2);
assert.strictEqual(quotaAccountsOk.allowed, true);
assert.strictEqual(quotaAccountsOk.remaining, 1);

const quotaAccountsExceeded = checkResourceQuota('starter', 'socialAccounts', 3);
assert.strictEqual(quotaAccountsExceeded.allowed, false);
assert.strictEqual(quotaAccountsExceeded.remaining, 0);
assert.ok(quotaAccountsExceeded.reason?.includes('atingiu o limite'));

// 3. Validação de Cotas Ilimitadas (Pro)
const quotaPostsPro = checkResourceQuota('pro', 'postsThisMonth', 500);
assert.strictEqual(quotaPostsPro.allowed, true);
assert.strictEqual(quotaPostsPro.limit, -1);
assert.strictEqual(quotaPostsPro.remaining, Infinity);

// 4. Limites de membros (Agency)
const quotaMembersOk = checkResourceQuota('agency', 'teamMembers', 14);
assert.strictEqual(quotaMembersOk.allowed, true);
assert.strictEqual(quotaMembersOk.remaining, 1);

const quotaMembersExceeded = checkResourceQuota('agency', 'teamMembers', 15);
assert.strictEqual(quotaMembersExceeded.allowed, false);

console.log('✅ Validação de cotas e limites aprovada.');

console.log('✅ Todos os testes de Faturamento e Planos passaram com 100% de sucesso!');
process.exit(0);
