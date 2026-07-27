import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PieceDetail } from "@/components/showcase/PieceDetail";
import { getShowcasePiece, showcaseDetailSlugs } from "@/lib/showcase";
import { site } from "@/lib/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return showcaseDetailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = getShowcasePiece(slug);
  if (!piece || piece.externalHref) return {};
  return {
    title: `${piece.name.en} | Plexus Workshop`,
    description: `${piece.line.en} — ${piece.story.en}`,
    alternates: { canonical: `/showcase/${slug}` },
    openGraph: {
      title: `${piece.name.en} | Plexus Workshop`,
      description: piece.line.en,
      images: [{ url: `${site.url}${piece.hero}` }],
    },
  };
}

export default async function ShowcasePiecePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = getShowcasePiece(slug);
  // NAWAH is a standalone static page (public/showcase/nawah/), not this template.
  if (!piece || piece.externalHref) notFound();
  return <PieceDetail piece={piece} />;
}
