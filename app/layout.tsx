import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { LanguageProvider } from "@/components/language-provider";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Visave App | Free Video Downloader & AI Tools",
    template: "%s | Visave App",
  },
  description: "Free online video downloader for TikTok, Instagram, YouTube, Facebook. Download videos without watermark. AI-powered video summarization and analysis tools.",
  keywords: [
    "video downloader",
    "TikTok downloader",
    "Instagram video download",
    "YouTube downloader",
    "Facebook video download",
    "remove watermark",
    "AI summary",
    "video to audio",
    "free video tools",
    "no watermark download"
  ],
  authors: [{ name: "Visave App" }],
  creator: "Visave App",
  publisher: "Visave App",
  metadataBase: new URL("https://visaveapp.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "vi_VN",
    url: "https://visaveapp.com",
    siteName: "Visave App",
    title: "Visave App | Free Video Downloader & AI Tools",
    description: "Free online video downloader for TikTok, Instagram, YouTube, Facebook. Download videos without watermark. AI-powered video summarization and analysis tools.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Visave App - Video Downloader & AI Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visave App | Free Video Downloader & AI Tools",
    description: "Free video downloader for TikTok, Instagram, YouTube. No watermark. AI tools included.",
    images: ["/assets/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    other: {
      "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_ID || "",
    },
  },
  icons: {
    icon: "/assets/b-logo.png",
    apple: "/assets/b-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <QueryProvider>
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </QueryProvider>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}

