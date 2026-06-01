import type { Metadata } from "next";
import {
  Fraunces,
  Hanken_Grotesk,
  JetBrains_Mono,
  Cairo,
  Reem_Kufi,
} from "next/font/google";
import "./globals.css";
import { brand, site } from "@/lib/config";
import { LanguageProvider } from "@/lib/i18n/context";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { StructuredData } from "@/components/seo/StructuredData";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const reem = Reem_Kufi({
  variable: "--font-reem",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  // Google Search Console domain verification. Set GOOGLE_SITE_VERIFICATION in
  // the environment (.env.local + Vercel) to the token from Search Console →
  // Settings → Ownership verification → HTML tag. Omitted when unset.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  title: {
    default: `${brand.full} — ${brand.tagline}`,
    template: `%s · ${brand.full}`,
  },
  description: brand.description,
  keywords: [
    "woodworking Amman",
    "custom furniture Jordan",
    "bespoke wood",
    "PLEXUS",
    "handmade furniture Amman",
    "3D custom furniture",
  ],
  openGraph: {
    title: `${brand.full} — ${brand.tagline}`,
    description: brand.description,
    type: "website",
    locale: "en_JO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${jetbrains.variable} ${cairo.variable} ${reem.variable}`}
    >
      <body>
        <StructuredData />
        <LanguageProvider>
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
