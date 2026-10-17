import { NextRequest, NextResponse } from 'next/server';
import { resolveAndTrackShortLink } from '@/lib/shortlinks/service';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

function detectChannelFromReferer(referer?: string | null): string | undefined {
  if (!referer) return undefined;
  const ref = referer.toLowerCase();
  if (ref.includes('instagram.com')) return 'instagram';
  if (ref.includes('threads.net')) return 'threads';
  if (ref.includes('linkedin.com')) return 'linkedin';
  if (ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('x.com')) return 'x';
  if (ref.includes('facebook.com')) return 'facebook';
  if (ref.includes('whatsapp.com')) return 'whatsapp';
  if (ref.includes('youtube.com')) return 'youtube';
  return undefined;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  if (!slug || !slug.trim()) {
    return NextResponse.redirect(new URL('/', req.url), { status: 302 });
  }

  const referer = req.headers.get('referer');
  const userAgent = req.headers.get('user-agent');
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : (req.headers.get('x-real-ip') || undefined);

  // Canal explícito por query param ou heurística de referer
  const { searchParams } = new URL(req.url);
  const explicitChannel = searchParams.get('src') || searchParams.get('network');
  const channelHint = explicitChannel || detectChannelFromReferer(referer);

  try {
    const result = await resolveAndTrackShortLink(slug, {
      referer: referer || undefined,
      userAgent: userAgent || undefined,
      ipAddress: ipAddress || undefined,
      channelHint: channelHint || undefined,
    });

    if (!result) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Link não encontrado | HupFlow</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #09090b;
      color: #fafafa;
      text-align: center;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 1rem;
      padding: 2.5rem 2rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #f43f5e;
      font-weight: 800;
    }
    p {
      color: #a1a1aa;
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0 0 1.5rem 0;
    }
    a {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      transition: background 0.2s;
    }
    a:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>404</h1>
    <p>O link encurtado solicitado n&atilde;o existe, foi removido ou expirou.</p>
    <a href="/">Ir para a p&aacute;gina inicial</a>
  </div>
</body>
</html>`,
        {
          status: 404,
          headers: { 'content-type': 'text/html; charset=utf-8' },
        }
      );
    }

    // Redirecionamento 302 Found (evita cache permanente no browser para permitir telemetria em tempo real)
    return NextResponse.redirect(result.destinationUrl, { status: 302 });
  } catch (err) {
    console.error('[ShortLink Redirect] Erro ao redirecionar slug:', slug, err);
    return NextResponse.redirect(new URL('/', req.url), { status: 302 });
  }
}
