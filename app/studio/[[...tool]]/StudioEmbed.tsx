"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

/** The actual Studio SPA — only rendered once a Project ID is configured. */
export function StudioEmbed() {
  return <NextStudio config={config} />;
}
