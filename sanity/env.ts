// Sanity connection config, read from env. Fill these in .env.local after you
// create a free project at https://www.sanity.io/manage (see SANITY-SETUP.md).
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** True once a real project id is configured — lets the site fall back to the
 *  static catalogue until Sanity is wired up. */
export const sanityConfigured = projectId.length > 0;
