# Investigação Técnica: Smart Link-in-Bio Multi-Link & Showcase

## 1. Arquitetura da Rota Pública `/bio/[handle]`
- Next.js App Router permite criar a rota dinâmica `src/app/bio/[handle]/page.tsx`.
- Essa rota é pública (sem exigência de sessão/auth) para que qualquer visitante da internet ou das redes sociais consiga visualizá-la instantaneamente.
- Metadados dinâmicos com Open Graph (`generateMetadata`) para que ao compartilhar o link no WhatsApp, Telegram, X ou LinkedIn, a miniatura, avatar e título da marca apareçam formatados.

## 2. Modelagem dos Temas (Zero Dependência CSS Externa)
Os temas visuais são gerados através de variáveis CSS inline e classes Tailwind existentes no projeto:
- `midnight`: Fundo escuro (#09090b), botões de vidro (#18181b / border-zinc-800), texto branco, acento violeta (#8b5cf6).
- `minimal_light`: Fundo branco (#fafafa), botões brancos com sombra sutil e borda neutra, acento preto (#18181b).
- `sunset_gradient`: Gradiente vibrante (from-amber-500 to-rose-600), botões brancos translúcidos com blur.
- `ocean_breeze`: Gradiente azul/ciano (from-sky-500 to-indigo-700), botões em vidro fosco.
- `emerald_luxe`: Fundo verde floresta escuro (#064e3b), botões com acentos dourados e esmeralda.

## 3. Rastreamento Assíncrono de Cliques
- Cada botão renderiza um `<a>` com `href` direto para garantir SEO e fallback funcional, mas com um `onClick` que executa `navigator.sendBeacon` ou `fetch('/api/bio/click', { keepalive: true, method: 'POST', body: ... })`.
- Isso garante que a telemetria é coletada sem atrasar a navegação do visitante.
