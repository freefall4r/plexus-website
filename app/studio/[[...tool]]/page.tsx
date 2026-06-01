/**
 * Plexus Workshop — Sanity Studio (the product dashboard), mounted at /studio.
 * Once NEXT_PUBLIC_SANITY_PROJECT_ID is set, this becomes your full dashboard.
 * Until then it shows a short setup note (so the build never breaks).
 */
import { sanityConfigured } from "@/sanity/env";
import { StudioEmbed } from "./StudioEmbed";

export const dynamic = "force-static";

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ece4d4",
          color: "#463526",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <p style={{ letterSpacing: "0.2em", fontSize: 12, opacity: 0.7 }}>
            Plexus Workshop · STUDIO
          </p>
          <h1 style={{ fontSize: 28, margin: "0.5rem 0 1rem" }}>
            Almost ready — one step left
          </h1>
          <p style={{ lineHeight: 1.6 }}>
            Create a free project at{" "}
            <a href="https://www.sanity.io/manage" style={{ color: "#9c5f3e" }}>
              sanity.io/manage
            </a>
            , copy its <strong>Project ID</strong>, and paste it into{" "}
            <code>.env.local</code> as{" "}
            <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>. Full steps are in{" "}
            <code>SANITY-SETUP.md</code>. Then refresh this page and your product
            dashboard appears here.
          </p>
        </div>
      </main>
    );
  }

  return <StudioEmbed />;
}
