import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "WarmCup — Warm support when panic hits",
  description:
    "When panic or anxiety hits, real people are here — feeling the same thing. Open chat instantly. Anonymous, free, no signup.",
  keywords: ["panic attack", "anxiety support", "real-time chat", "mental health", "not alone", "panic disorder", "anxiety chat"],
  openGraph: {
    title: "WarmCup — You are not alone.",
    description: "Real people, real-time, right now. Open the door when panic hits. Free · Anonymous · No signup.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WarmCup — You are not alone.",
    description: "Real people, real-time, right now. Open the door when panic hits. Free · Anonymous · No signup.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0d0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Replace ca-pub-XXXXXXXXXXXXXXXX with your real Google AdSense publisher ID */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <body>{children}</body>
    </html>
  );
}
