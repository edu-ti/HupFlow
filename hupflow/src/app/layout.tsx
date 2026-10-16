import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HupFlow | A Plataforma Moderna de Automação & Criação para Redes Sociais',
  description: 'Crie carrosséis de alto impacto com IA, redija posts magnéticos e agende publicações em todas as suas redes com total controle e segurança.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#07090E] text-slate-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
        {children}
      </body>
    </html>
  );
}
