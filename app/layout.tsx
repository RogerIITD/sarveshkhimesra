import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import Nav from "@/components/Nav";
import SocialDock from "@/components/SocialDock";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sarvesh Khimesra",
  description:
    "Sarvesh Khimesra. AI experimenter, builder, poet, sports nerd. Let's connect.",
  openGraph: {
    title: "Sarvesh Khimesra",
    description: "A generalist who loves strategy, tech, and way too many interests.",
    type: "website",
  },
  themeColor: "#2d8f6f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Georgia&family=Tiro+Devanagari+Hindi&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-328CQS0Z6D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-328CQS0Z6D');
          `}
        </Script>
      </head>
      <body className="font-body bg-bg text-text antialiased">
        <Nav />
        <SocialDock />
        <main>{children}</main>
      </body>
    </html>
  );
}
