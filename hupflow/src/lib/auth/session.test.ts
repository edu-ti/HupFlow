import { getAuthContext, requireAuthContext } from './session';

async function testSessionAuth() {
  console.log('[TEST] Iniciando testes de getAuthContext e requireAuthContext...');

  // Teste 1: Modo de desenvolvimento (padrão)
  (process.env as any).NODE_ENV = 'development';
  process.env.DEV_BYPASS_AUTH = 'true';

  const headers = new Headers();
  const context = await getAuthContext(headers);

  if (!context) {
    throw new Error('Falha: getAuthContext deveria retornar fallback de dev');
  }

  if (context.organizationId !== 'org_default') {
    throw new Error(`Esperava org_default, obteve ${context.organizationId}`);
  }

  if (!context.isDevFallback) {
    throw new Error('Flag isDevFallback deveria ser true no modo dev');
  }

  // Teste 2: Customização de org via header x-organization-id no modo dev
  const headersWithOrg = new Headers();
  headersWithOrg.set('x-organization-id', 'org_cliente_beta');
  const contextCustomOrg = await getAuthContext(headersWithOrg);

  if (!contextCustomOrg || contextCustomOrg.organizationId !== 'org_cliente_beta') {
    throw new Error(`Falha ao resolver organizationId customizado: ${contextCustomOrg?.organizationId}`);
  }

  // Teste 3: Customização de org via cookie hupflow_active_org
  const headersWithCookie = new Headers();
  headersWithCookie.set('cookie', 'hupflow_active_org=org_agencia_gama; other=123');
  const contextCookieOrg = await getAuthContext(headersWithCookie);

  if (!contextCookieOrg || contextCookieOrg.organizationId !== 'org_agencia_gama') {
    throw new Error(`Falha ao resolver organizationId via cookie: ${contextCookieOrg?.organizationId}`);
  }

  // Teste 4: requireAuthContext no modo dev
  const requireResult = await requireAuthContext(headers);
  if (requireResult.error !== null || !requireResult.context) {
    throw new Error('Falha no requireAuthContext para requisição válida em dev');
  }

  // Teste 5: Modo de produção sem sessão (deve retornar null e 401)
  (process.env as any).NODE_ENV = 'production';
  process.env.DEV_BYPASS_AUTH = 'false';

  const prodContext = await getAuthContext(new Headers());
  if (prodContext !== null) {
    throw new Error('Falha: getAuthContext deveria retornar null em produção sem sessão');
  }

  const prodRequire = await requireAuthContext(new Headers());
  if (prodRequire.error === null || prodRequire.context !== null) {
    throw new Error('Falha: requireAuthContext deveria retornar erro em produção sem sessão');
  }

  // Restaura ambiente
  (process.env as any).NODE_ENV = 'development';
  process.env.DEV_BYPASS_AUTH = 'true';

  console.log('✅ Todos os testes de getAuthContext passaram com 100% de sucesso!');
  process.exit(0);
}

testSessionAuth();
