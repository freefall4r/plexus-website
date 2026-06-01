import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId, sanityConfigured } from "../env";

const builder = sanityConfigured
  ? imageUrlBuilder({ projectId, dataset })
  : null;

// Derive the accepted image-source type from the builder itself, so we don't
// depend on a deep import path that changes between versions.
type ImageSource = Parameters<NonNullable<typeof builder>["image"]>[0];

/** Build an optimized image URL from a Sanity image ref. Returns "" if unset. */
export function urlForImage(
  source: ImageSource | undefined | null,
  width = 1200
): string {
  if (!builder || !source) return "";
  return builder.image(source).width(width).auto("format").fit("max").url();
}
