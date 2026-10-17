import assert from 'node:assert';
import {
  parseFeedXml,
  cleanSummaryText,
  synthesizeRssPostContent,
} from './service';

console.log('[TEST] Iniciando bateria de testes do Integrador de Feeds RSS/Atom...');

// ----------------------------------------------------------------------------
// Teste 1: Parser Nativo de Feed RSS 2.0
// ----------------------------------------------------------------------------
const sampleRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog HupFlow Tech</title>
    <link>https://hupflow.com/blog</link>
    <description>Novidades sobre automação e IA</description>
    <item>
      <title><![CDATA[Como Escalar seu SaaS B2B sem Aumentar a Equipe]]></title>
      <link>https://hupflow.com/blog/escalar-saas-b2b</link>
      <guid isPermaLink="true">https://hupflow.com/blog/escalar-saas-b2b</guid>
      <pubDate>Fri, 16 Oct 2026 18:00:00 GMT</pubDate>
      <description><![CDATA[<p>Descubra os 3 pilares práticos que permitiram dobrar a eficiência operacional usando <strong>automação limpa</strong>.</p>]]></description>
      <enclosure url="https://hupflow.com/images/saas-scale.jpg" type="image/jpeg" length="12345" />
    </item>
    <item>
      <title>O Fim dos Carrosséis Feios no LinkedIn</title>
      <link>https://hupflow.com/blog/carrosseis-linkedin</link>
      <guid>post_unique_002</guid>
      <pubDate>Thu, 15 Oct 2026 12:00:00 GMT</pubDate>
      <description>Como gerar documentos PDF nativos de alto impacto com Fabric.js.</description>
    </item>
  </channel>
</rss>`;

const parsedRss = parseFeedXml(sampleRssXml);
assert.strictEqual(parsedRss.title, 'Blog HupFlow Tech');
assert.strictEqual(parsedRss.items.length, 2, 'Deve extrair exatamente 2 itens do feed RSS');

const item1 = parsedRss.items[0];
assert.strictEqual(item1.title, 'Como Escalar seu SaaS B2B sem Aumentar a Equipe');
assert.strictEqual(item1.link, 'https://hupflow.com/blog/escalar-saas-b2b');
assert.strictEqual(item1.guid, 'https://hupflow.com/blog/escalar-saas-b2b');
assert.ok(item1.imageUrl?.includes('saas-scale.jpg'), 'Deve capturar URL de imagem de enclosure');
assert.ok(!item1.summary.includes('<p>'), 'Deve higienizar tags HTML do resumo');
assert.ok(!item1.summary.includes('<strong>'), 'Deve higienizar tags strong');
console.log('✅ Parser de RSS 2.0 nativo aprovado.');

// ----------------------------------------------------------------------------
// Teste 2: Parser Nativo de Feed Atom
// ----------------------------------------------------------------------------
const sampleAtomXml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Notícias Globais de IA</title>
  <link href="https://news.example.com" />
  <entry>
    <title>Modelos Multimodais Revolucionam Design</title>
    <link href="https://news.example.com/ai-design" />
    <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
    <updated>2026-10-16T14:30:00Z</updated>
    <summary>A inteligência artificial agora entende diagramas vetoriais nativos.</summary>
  </entry>
</feed>`;

const parsedAtom = parseFeedXml(sampleAtomXml);
assert.strictEqual(parsedAtom.title, 'Notícias Globais de IA');
assert.strictEqual(parsedAtom.items.length, 1, 'Deve extrair 1 item do feed Atom');
assert.strictEqual(parsedAtom.items[0].guid, 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a');
assert.strictEqual(parsedAtom.items[0].link, 'https://news.example.com/ai-design');
console.log('✅ Parser de Atom nativo aprovado.');

// ----------------------------------------------------------------------------
// Teste 3: Limpeza de Texto e Resumo
// ----------------------------------------------------------------------------
const dirtyText = '<p>Texto com &amp; entidades &quot;HTML&quot; e <a href="#">links</a>...</p>';
const clean = cleanSummaryText(dirtyText);
assert.strictEqual(clean, 'Texto com & entidades "HTML" e links...');
console.log('✅ Sanitização de HTML e decodificação de entidades aprovadas.');

// ----------------------------------------------------------------------------
// Teste 4: Síntese de Post Social com IA (LinkedIn e X)
// ----------------------------------------------------------------------------
const articleMock = {
  title: 'Como Otimizar Campanhas Sociais com Automação Inteligente',
  link: 'https://hupflow.com/blog/campanhas-sociais',
  summary: 'Um guia detalhado sobre como marcas líderes aumentaram o ROI em 3x organizando calendários em lotes.',
};

const synthesizedLinkedIn = synthesizeRssPostContent(articleMock, 'linkedin');
assert.ok(synthesizedLinkedIn.content.includes(articleMock.title), 'Post deve mencionar o título ou tema do artigo');
assert.ok(synthesizedLinkedIn.content.includes(articleMock.link), 'Post deve incluir link original');
assert.ok(synthesizedLinkedIn.hashtags.length >= 2, 'Deve sugerir hashtags temáticas');
assert.ok(synthesizedLinkedIn.hooks.length > 0, 'Deve gerar ao menos um gancho magnético');

const synthesizedX = synthesizeRssPostContent(articleMock, 'x');
assert.ok(synthesizedX.content.length <= 280, 'Versão do X/Twitter deve respeitar limite de 280 caracteres');
assert.ok(synthesizedX.content.includes(articleMock.link), 'Versão do X deve conter o link');
console.log('✅ Síntese adaptativa por rede social aprovada.');

console.log('🎉 Todos os testes unitários do Integrador RSS passaram com 100% de sucesso!');
process.exit(0);
