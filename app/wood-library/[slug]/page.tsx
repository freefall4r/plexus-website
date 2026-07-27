import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WoodDetail } from "@/components/library/WoodDetail";
import { ExplainerDetail } from "@/components/library/ExplainerDetail";
import { ArticleDetail } from "@/components/library/ArticleDetail";
import { getWoodArticle, allArticleSlugs } from "@/lib/woodArticles";
import {
  getLibraryEntries,
  getLibraryEntry,
  getExplainerBySlug,
  relatedEntries,
} from "@/lib/woodCatalogue";
import { allLibrarySlugs } from "@/lib/woodLibrary";
import { site } from "@/lib/config";

export const revalidate = 60;
export const dynamicParams = true; // allow woods added later via Sanity

export function generateStaticParams() {
  return [...allLibrarySlugs(), ...allArticleSlugs()].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const explainer = getExplainerBySlug(slug);
  if (explainer) {
    return {
      title: `${explainer.title} | Plexus Workshop`,
      description: explainer.summary,
      alternates: { canonical: `/wood-library/${slug}` },
    };
  }

  const article = getWoodArticle(slug);
  if (article) {
    return {
      title: `${article.title} | Plexus Workshop`,
      description: article.summary,
      alternates: { canonical: `/wood-library/${slug}` },
    };
  }

  const entry = await getLibraryEntry(slug);
  if (entry) {
    return {
      title: `${entry.name} — Wood Guide | Plexus Workshop`,
      description: entry.intro,
      alternates: { canonical: `/wood-library/${slug}` },
    };
  }

  return { title: "Not found" };
}

export default async function LibraryEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Explainers and wood entries share the /wood-library/[slug] space.
  const explainer = getExplainerBySlug(slug);
  if (explainer) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: explainer.title,
      description: explainer.summary,
      image: `${site.url}${explainer.image}`,
      author: { "@type": "Organization", name: "Plexus Workshop" },
      publisher: { "@type": "Organization", name: "Plexus Workshop" },
      mainEntityOfPage: `${site.url}/wood-library/${slug}`,
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ExplainerDetail explainer={explainer} />
      </>
    );
  }

  const article = getWoodArticle(slug);
  if (article) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.summary,
      image: `${site.url}${article.image}`,
      datePublished: article.date,
      author: { "@type": "Organization", name: "Plexus Workshop" },
      publisher: { "@type": "Organization", name: "Plexus Workshop" },
      mainEntityOfPage: `${site.url}/wood-library/${slug}`,
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ArticleDetail article={article} />
      </>
    );
  }

  const entry = await getLibraryEntry(slug);
  if (!entry) notFound();

  const all = await getLibraryEntries();
  const related = relatedEntries(all, entry, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${entry.name} — Wood Guide`,
    description: entry.intro,
    image: `${site.url}${entry.image}`,
    author: { "@type": "Organization", name: "Plexus Workshop" },
    publisher: { "@type": "Organization", name: "Plexus Workshop" },
    mainEntityOfPage: `${site.url}/wood-library/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WoodDetail entry={entry} related={related} />
    </>
  );
}
