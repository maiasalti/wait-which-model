import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/Nav";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Wait Which Model?",
  description:
    "A directory, comparison instrument, and news log for frontier AI models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GJFVT58K8P"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-GJFVT58K8P');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 sm:px-6">
          {children}
        </main>
        <footer className="mono flex flex-col items-center gap-1.5 border-t border-line px-4 py-6 text-center text-xs text-ink-3">
          <p>
            Wait Which Model? · data curated via the release &amp; news-scan
            protocols · figures are launch-time reported scores
          </p>
          <p>
            Created by Maia Salti ·{" "}
            <a
              href="mailto:maia.salti@gmail.com"
              className="text-accent hover:underline"
            >
              Contact me
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
