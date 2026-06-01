import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogue, getCatalogueProduct, relatedFrom } from "@/lib/catalogue";
import { ProductDetail } from "@/components/shop/ProductDetail";

export const revalidate = 30;
export const dynamicParams = true; // allow products added later (e.g. via Sanity)

export async function generateStaticParams() {
  const items = await getCatalogue();
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogueProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.blurb,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogueProduct(slug);
  if (!product) notFound();
  const all = await getCatalogue();
  const related = relatedFrom(all, product, 4);
  return <ProductDetail product={product} related={related} />;
}
