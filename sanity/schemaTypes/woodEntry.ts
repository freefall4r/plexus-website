import { defineType, defineField } from "sanity";

const CATEGORIES = [
  { title: "Hardwood", value: "hardwood" },
  { title: "Softwood", value: "softwood" },
  { title: "Engineered wood", value: "engineered" },
];

/** A single Wood Library entry — a solid wood (oak, walnut…) or an engineered
 *  board (plywood, MDF…). Edited in /studio; the site falls back to the
 *  built-in set in lib/woodLibrary.ts when none exist. */
export const woodEntry = defineType({
  name: "woodEntry",
  title: "Wood Library Entry",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "arabic", title: "العربية (Arabic)" },
    { name: "facts", title: "Facts & uses" },
    { name: "media", title: "Image" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name (English)",
      type: "string",
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name_ar",
      title: "Name (Arabic)",
      type: "string",
      group: "arabic",
    }),
    defineField({
      name: "localName_ar",
      title: "Local trade name (Arabic)",
      type: "string",
      group: "arabic",
      description: 'e.g. "أبلكاش", "لاتيه" — the name carpenters actually use',
    }),
    defineField({
      name: "botanical",
      title: "Botanical / Latin name",
      type: "string",
      group: "main",
      description: "For solid woods, e.g. Quercus (oak). Leave blank for engineered.",
    }),
    defineField({
      name: "slug",
      title: "Slug (web address)",
      type: "slug",
      group: "main",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "main",
      options: { list: CATEGORIES, layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Grain / material image",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),
    defineField({
      name: "tagline",
      title: "Card tagline (English)",
      type: "string",
      group: "main",
      description: 'Short descriptor on the card, e.g. "Hard · open grain · classic"',
    }),
    defineField({
      name: "tagline_ar",
      title: "Card tagline (Arabic)",
      type: "string",
      group: "arabic",
    }),
    defineField({
      name: "intro",
      title: "Intro (English)",
      type: "text",
      rows: 3,
      group: "main",
    }),
    defineField({
      name: "intro_ar",
      title: "Intro (Arabic)",
      type: "text",
      rows: 3,
      group: "arabic",
    }),
    defineField({
      name: "facts",
      title: "Facts",
      type: "array",
      group: "facts",
      description: "The numbers — hardness, density, stability, etc.",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label (EN)", type: "string" },
            { name: "label_ar", title: "Label (AR)", type: "string" },
            { name: "value", title: "Value (EN)", type: "string" },
            { name: "value_ar", title: "Value (AR)", type: "string" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "uses",
      title: "Best uses (English)",
      type: "array",
      group: "facts",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "uses_ar",
      title: "Best uses (Arabic)",
      type: "array",
      group: "facts",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "watchOut",
      title: "Watch out for (English)",
      type: "text",
      rows: 3,
      group: "facts",
    }),
    defineField({
      name: "watchOut_ar",
      title: "Watch out for (Arabic)",
      type: "text",
      rows: 3,
      group: "facts",
    }),
    defineField({
      name: "notes",
      title: "Engineer's notes (English)",
      type: "text",
      rows: 4,
      group: "main",
      description: "Your personal expert take — the part nobody else can write.",
    }),
    defineField({
      name: "notes_ar",
      title: "Engineer's notes (Arabic)",
      type: "text",
      rows: 4,
      group: "arabic",
    }),
  ],
  orderings: [
    {
      title: "Category",
      name: "category",
      by: [{ field: "category", direction: "asc" }, { field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ? String(subtitle) : undefined, media };
    },
  },
});
