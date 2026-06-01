"use client";

/**
 * Sanity Studio config — the dashboard mounted at /studio.
 * Project id / dataset come from .env.local (see SANITY-SETUP.md).
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";

export default defineConfig({
  name: "plexus-studio",
  title: "PLEXUS AMMAN — Catalogue",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
