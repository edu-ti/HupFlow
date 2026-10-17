import assert from 'node:assert';
import {
  generateShortSlug,
  sanitizeSlug,
  buildUtmUrl,
  generateChannelVariants,
} from './service';
import { SocialNetwork, ShortLinkVariant } from './types';

console.log('[TEST] Iniciando bateria de testes do Subsistema de Shortlinks & Tags UTM...');

// ----------------------------------------------------------------------------
// Teste 1: Gerador de Slugs Base62
// ----------------------------------------------------------------------------
const slug1 = generateShortSlug(6);
const slug2 = generateShortSlug(6);
const slugCustomLen = generateShortSlug(10);

assert.strictEqual(slug1.length, 6, 'O slug gerado por padrão deve ter 6 caracteres');
assert.strictEqual(slugCustomLen.length, 10, 'O slug deve respeitar o comprimento fornecido');
assert.ok(/^[0-9a-zA-Z]+$/.test(slug1), 'O slug deve conter exclusivamente caracteres Base62');
assert.notStrictEqual(slug1, slug2, 'Dois slugs subsequentes gerados devem ser criptograficamente distintos');
console.log('✅ Geração de slugs Base62 criptográficos validada.');

// ----------------------------------------------------------------------------
// Teste 2: Sanitização e Normalização de Slugs Personalizados
// ----------------------------------------------------------------------------
const raw1 = '  Promoção de Verão 2026!  ';
const clean1 = sanitizeSlug(raw1);
assert.strictEqual(clean1, 'promocao-de-verao-2026', 'Deve normalizar acentos, espaços e pontuação');

const raw2 = '---Super---Desconto---';
const clean2 = sanitizeSlug(raw2);
assert.strictEqual(clean2, 'super-desconto', 'Deve condensar hífens repetidos e remover bordas');

const raw3 = 'Link_Com_Underline-123';
const clean3 = sanitizeSlug(raw3);
assert.strictEqual(clean3, 'link_com_underline-123', 'Deve manter números, underlines e hífens');
console.log('✅ Higienização e conformidade de slugs personalizados validada.');

// ----------------------------------------------------------------------------
// Teste 3: Injeção de Parâmetros UTM e Preservação de Query Strings
// ----------------------------------------------------------------------------
const destinationUrl = 'https://meusite.com.br/produto?ref=banner';
const utmUrl = buildUtmUrl(destinationUrl, {
  utmSource: 'instagram',
  utmMedium: 'social',
  utmCampaign: 'black-friday',
  utmContent: 'story-01',
  utmTerm: 'calcado',
});

const parsed = new URL(utmUrl);
assert.strictEqual(parsed.origin, 'https://meusite.com.br');
assert.strictEqual(parsed.pathname, '/produto');
assert.strictEqual(parsed.searchParams.get('ref'), 'banner', 'Deve preservar parâmetros preexistentes');
assert.strictEqual(parsed.searchParams.get('utm_source'), 'instagram');
assert.strictEqual(parsed.searchParams.get('utm_medium'), 'social');
assert.strictEqual(parsed.searchParams.get('utm_campaign'), 'black-friday');
assert.strictEqual(parsed.searchParams.get('utm_content'), 'story-01');
assert.strictEqual(parsed.searchParams.get('utm_term'), 'calcado');

// Teste sem protocolo inicial
const noProtoUrl = buildUtmUrl('empresa.com/pagina', { utmSource: 'threads' });
assert.ok(noProtoUrl.startsWith('https://empresa.com/pagina?utm_source=threads'));
console.log('✅ Injeção de tags UTM e integridade de query params validada.');

// ----------------------------------------------------------------------------
// Teste 4: Geração de Variantes Multicanal (Instagram, Threads, LinkedIn, X)
// ----------------------------------------------------------------------------
const variants: ShortLinkVariant[] = generateChannelVariants('https://hupflow.com/blog', {
  utmCampaign: 'launch-2026',
  utmMedium: 'social',
});

assert.strictEqual(variants.length, 4, 'Devem existir 4 variantes sociais nativas');

const networks = variants.map((v) => v.network);
assert.ok(networks.includes('instagram'));
assert.ok(networks.includes('threads'));
assert.ok(networks.includes('linkedin'));
assert.ok(networks.includes('x'));

const igVariant = variants.find((v) => v.network === 'instagram');
assert.ok(igVariant?.url.includes('utm_source=instagram'));
assert.ok(igVariant?.url.includes('utm_campaign=launch-2026'));

const xVariant = variants.find((v) => v.network === 'x');
assert.ok(xVariant?.url.includes('utm_source=x'));
console.log('✅ Geração de variantes por rede social validada.');

console.log('🎉 Todos os testes de Shortlinks & UTMs passaram com 100% de sucesso!');
process.exit(0);
