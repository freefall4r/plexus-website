import type { Metadata } from "next";
import {
  Fraunces,
  Hanken_Grotesk,
  JetBrains_Mono,
  Cairo,
  Reem_Kufi,
} from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/config";
import { LanguageProvider } from "@/lib/i18n/context";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ContactDock } from "@/components/layout/ContactDock";

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
  metadataBase: new URL("https://plexusamman.com"),
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
      <body className="grain min-h-screen flex flex-col">
        <LanguageProvider>
          <Cursor />
          <SmoothScroll>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScroll>
          <ContactDock />
        </LanguageProvider>
      </body>
    </html>
  );
}
