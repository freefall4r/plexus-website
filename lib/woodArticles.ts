// The Wood Journal — dated articles that live as JSON files in
// content/wood-articles/*.json. A new article = one new JSON file;
// the site picks it up on the next deploy. This is the lane the
// daily article machine writes into.
//
// Server-side only (uses fs) — client components import the
// WoodArticle type from lib/woodLibrary.ts instead.

import fs from "fs";
import path from "path";
import type { WoodArticle } from "./woodLibrary";

const DIR = path.join(process.cwd(), "content", "wood-articles");

function isValid(a: unknown): a is WoodArticle {
  if (!a || typeof a !== "object") return false;
  const x = a as Record<string, unknown>;
  return (
    typeof x.slug === "string" &&
    typeof x.date === "string" &&
    typeof x.title === "string" &&
    typeof x.title_ar === "string" &&
    Array.isArray(x.sections) &&
    x.sections.length > 0
  );
}

/** All articles, newest first. Broken files are skipped, never fatal. */
export function getWoodArticles(): WoodArticle[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const out: WoodArticle[] = [];
  for (const f of files) {
    try {
      const parsed = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
      if (isValid(parsed)) out.push(parsed);
    } catch {
      // A malformed article must never take the library down.
    }
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getWoodArticle(slug: string): WoodArticle | undefined {
  return getWoodArticles().find((a) => a.slug === slug);
}

export function allArticleSlugs(): string[] {
  return getWoodArticles().map((a) => a.slug);
}
