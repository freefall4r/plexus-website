import type { Metadata } from "next";
import { LibraryIndex } from "@/components/library/LibraryIndex";
import { getLibraryEntries, getExplainers } from "@/lib/woodCatalogue";
import { getWoodArticles } from "@/lib/woodArticles";

export const metadata: Metadata = {
  title: "The Wood Library — A Wood Engineer's Guide | Plexus Workshop",
  description:
    "A working timber engineer's guide to wood: hardwood vs softwood, oak, walnut, beech, ash, pine, cedar, and engineered boards — plywood (أبلكاش), blockboard (لاتيه), MDF & HDF. Plain language, real numbers. دليل الأخشاب من بلكسس وركشوب.",
  alternates: { canonical: "/wood-library" },
};

export const revalidate = 60;

export default async function WoodLibraryPage() {
  const [entries, explainers] = await Promise.all([
    getLibraryEntries(),
    Promise.resolve(getExplainers()),
  ]);
  const articles = getWoodArticles();
  return (
    <LibraryIndex entries={entries} explainers={explainers} articles={articles} />
  );
}
