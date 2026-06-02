import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";
import type { CollectionConfig } from "payload";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// --- Users: who can log into /admin ---
const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email" },
  fields: [{ name: "name", type: "text" }],
};

// --- Media: uploaded images (stored in Vercel Blob in production) ---
const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: true,
  fields: [{ name: "alt", type: "text", label: "Alt text (for accessibility/SEO)" }],
};

// --- Products: the shop catalogue ---
const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "price", "category", "featured"],
  },
  access: { read: () => true },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
        { name: "name_ar", type: "text", label: "Name (Arabic)", admin: { width: "50%" } },
      ],
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL part, e.g. wave-hangers (lowercase, dashes)" },
    },
    {
      type: "row",
      fields: [
        { name: "price", type: "number", required: true, admin: { width: "33%", description: "Price in JOD" } },
        { name: "category", type: "select", admin: { width: "33%" }, defaultValue: "furniture",
          options: [
            { label: "Furniture", value: "furniture" },
            { label: "Objects", value: "objects" },
            { label: "Lighting", value: "lighting" },
            { label: "Tableware", value: "tableware" },
          ],
        },
        { name: "featured", type: "checkbox", admin: { width: "33%" }, defaultValue: false },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "wood", type: "text", label: "Material", admin: { width: "50%" } },
        { name: "wood_ar", type: "text", label: "Material (Arabic)", admin: { width: "50%" } },
      ],
    },
    { name: "blurb", type: "text", label: "Short blurb" },
    { name: "blurb_ar", type: "text", label: "Short blurb (Arabic)" },
    { name: "description", type: "textarea" },
    { name: "description_ar", type: "textarea", label: "Description (Arabic)" },
    { name: "dimensions", type: "text", admin: { description: "e.g. 120 × 45 × 75 cm" } },
    { name: "image", type: "upload", relationTo: "media", label: "Main image" },
    { name: "gallery", type: "array", fields: [{ name: "image", type: "upload", relationTo: "media" }] },
  ],
};

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  // Mount Payload's API at /cms-api so it doesn't collide with the site's /api/custom routes.
  routes: { api: "/cms-api" },
  collections: [Users, Media, Products],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    // Auto-sync the schema on boot. We can't generate migrations locally because
    // Vercel keeps the DB credentials server-side only, so Payload creates/updates
    // tables itself when it first connects on Vercel.
    push: true,
    pool: {
      connectionString:
        process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
