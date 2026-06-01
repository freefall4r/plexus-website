import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "../env";

/** Null until a Project ID is set in .env.local — callers fall back to the
 *  static catalogue so the site always builds and renders. */
export const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;
