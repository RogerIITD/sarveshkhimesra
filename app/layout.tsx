import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter, JetBrains_Mono, Tiro_Devanagari_Hindi } from 'next/font/google';
import './globals.css';
import { GameProvider } from '@/components/game/GameProvider';
import { KonamiListener } from '@/components/game/KonamiListener';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const hindi = Tiro_Devanagari_Hindi({ subsets: ['devanagari'], weight: '400', variable: '--font-hindi', display: 'swap' });
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  // absolute URLs for the link-preview image when shared on LinkedIn / WhatsApp / X
  metadataBase: new URL('https://sarveshkhimesra.vercel.app'),
  title: 'Sarvesh Khimesra',
  description: 'AI engineer driving business transformation, process excellence and AI strategy. Also: shayari, a song called Maafi, tennis, squash and cricket.',
  openGraph: {
    title: 'Sarvesh Khimesra',
    description: 'Business transformation × AI. Open the apps — shayari, music, sports, travel.',
    type: 'website',
    images: ['/images/os/headshot.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0d12',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${hindi.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-328CQS0Z6D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-328CQS0Z6D', { cookie_domain: location.hostname }); // vercel.app is a public suffix: pin cookies to our host or browsers reject them
        `}</Script>
      </head>
      <body>
        <GameProvider>
          {children}
          <KonamiListener />
        </GameProvider>
      </body>
    </html>
  );
}
