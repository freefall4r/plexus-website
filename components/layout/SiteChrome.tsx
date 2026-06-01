"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "./SmoothScroll";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ContactDock } from "./ContactDock";

/**
 * Wraps marketing pages with the site chrome (nav, footer, smooth scroll, grain).
 * On /studio it renders the dashboard bare — no nav/footer, no Lenis hijacking
 * the Studio's own scrolling.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <div className="grain flex min-h-screen flex-col">
      <SmoothScroll>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
      <ContactDock />
    </div>
  );
}
