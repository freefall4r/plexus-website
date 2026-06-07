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
import { CartProvider } from "@/lib/cart";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { StructuredData } from "@/components/seo/StructuredData";
import { Analytics } from "@vercel/analytics/next";

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
    "custom bookshelf Amman",
    "solid wood bookshelf Jordan",
    "floating shelves Jordan",
    "wooden bookcase Amman",
    "مكتبة خشب",
    "تفصيل مكتبة خشب",
    "مكتبة خشب عمان",
    "رفوف معلقة",
    "رفوف خشب",
  ],
  openGraph: {
    title: `${brand.full} — ${brand.tagline}`,
    description: brand.description,
    type: "website",
    locale: "en_JO",
    url: site.url,
    siteName: brand.full,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${brand.full} — custom furniture & objects in solid wood, Amman`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.full} — ${brand.tagline}`,
    description: brand.description,
    images: ["/og.jpg"],
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
        {/* Failsafe: content fades in via framer-motion JS (ships at opacity:0).
            If JS is disabled / blocked / errors (old or in-app browsers), reveal
            everything so the page is never blank. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){function r(){try{var e=document.querySelectorAll(\'[style*="opacity:0"],[style*="opacity: 0"]\');for(var i=0;i<e.length;i++){e[i].style.opacity="1";e[i].style.transform="none";}}catch(x){}}window.addEventListener("error",function(){setTimeout(r,150);});window.addEventListener("unhandledrejection",function(){setTimeout(r,150);});})();',
          }}
        />
        <StructuredData />
        <LanguageProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
