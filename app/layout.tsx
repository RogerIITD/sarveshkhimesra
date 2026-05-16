import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sarvesh Khimesra · AI Builder",
  description: "AI builder. GTM × AI. Joining Razorpay 2026.",
  openGraph: {
    title: "Sarvesh Khimesra · AI Builder",
    description: "Terminal-style portfolio. Click to serve. Type 'help'.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-328CQS0Z6D" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-328CQS0Z6D');
        `}</Script>
      </head>
      <body>
        {children}
        <div className="scanlines" aria-hidden />
      </body>
    </html>
  );
}
