// ── On-Demand Fabrication — Sanity content reads ──
// Pulls the landing-page examples and orderable templates from Sanity. Returns
// empty arrays if Sanity isn't configured, so the page still renders.

import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import type { FabricationService } from "./types";
import { SAMPLE_EXAMPLES, SAMPLE_TEMPLATES } from "./samples";

export type FabricationExample = {
  id: string;
  title: string;
  title_ar: string;
  service: FabricationService;
  imageUrl: string;
  material: string;
  material_ar: string;
  description: string;
  description_ar: string;
};

export type FabricationTemplate = {
  id: string;
  slug: string;
  title: string;
  title_ar: string;
  service: FabricationService;
  imageUrl: string;
  description: string;
  description_ar: string;
  defaultMaterial: string;
  defaultThickness: string;
};

const EXAMPLES_QUERY = `*[_type=="fabricationExample"] | order(order asc, _createdAt desc){
  "id": _id,
  title, "title_ar": coalesce(title_ar, title),
  service,
  "material": coalesce(material, ""), "material_ar": coalesce(material_ar, material, ""),
  "description": coalesce(description, ""), "description_ar": coalesce(description_ar, description, ""),
  image
}`;

const TEMPLATES_QUERY = `*[_type=="fabricationTemplate"] | order(order asc, _createdAt desc){
  "id": _id,
  "slug": slug.current,
  title, "title_ar": coalesce(title_ar, title),
  service,
  "description": coalesce(description, ""), "description_ar": coalesce(description_ar, description, ""),
  "defaultMaterial": coalesce(defaultMaterial, ""),
  "defaultThickness": coalesce(defaultThickness, ""),
  image
}`;

type WithImage = { image?: Parameters<typeof urlForImage>[0] };

export async function getFabricationExamples(): Promise<FabricationExample[]> {
  if (!client) return SAMPLE_EXAMPLES;
  try {
    const docs = await client.fetch<(FabricationExample & WithImage)[]>(
      EXAMPLES_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
    if (!docs || docs.length === 0) return SAMPLE_EXAMPLES;
    return docs.map(({ image, ...rest }) => ({
      ...rest,
      imageUrl: urlForImage(image, 1100),
    }));
  } catch {
    return SAMPLE_EXAMPLES;
  }
}

export async function getFabricationTemplates(): Promise<FabricationTemplate[]> {
  if (!client) return SAMPLE_TEMPLATES;
  try {
    const docs = await client.fetch<(FabricationTemplate & WithImage)[]>(
      TEMPLATES_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
    if (!docs || docs.length === 0) return SAMPLE_TEMPLATES;
    return docs.map(({ image, ...rest }) => ({
      ...rest,
      imageUrl: urlForImage(image, 900),
    }));
  } catch {
    return SAMPLE_TEMPLATES;
  }
}
