import { defineType, defineField } from "sanity";

const CATEGORIES = [
  { title: "Seating", value: "seating" },
  { title: "Tables", value: "tables" },
  { title: "Desk", value: "desk" },
  { title: "Storage", value: "storage" },
  { title: "Lighting", value: "lighting" },
  { title: "Decor", value: "decor" },
  { title: "Kitchenware", value: "kitchenware" },
  { title: "Wall", value: "wall" },
];

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "arabic", title: "العربية (Arabic)" },
    { name: "media", title: "Images" },
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
      name: "slug",
      title: "Slug (web address)",
      type: "slug",
      group: "main",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Main image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "More images",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "price",
      title: "Price (JOD)",
      type: "number",
      group: "main",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "main",
      options: { list: CATEGORIES, layout: "dropdown" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Objects", value: "objects" },
          { title: "Furniture", value: "furniture" },
        ],
        layout: "radio",
      },
      initialValue: "furniture",
    }),
    defineField({
      name: "wood",
      title: "Wood / material (English)",
      type: "string",
      group: "main",
      description: "e.g. Solid oak, Olive wood, Walnut",
    }),
    defineField({
      name: "wood_ar",
      title: "Wood / material (Arabic)",
      type: "string",
      group: "arabic",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      group: "main",
      description: 'e.g. "120 × 60 × 45 cm"',
    }),
    defineField({
      name: "blurb",
      title: "Short blurb (English)",
      type: "text",
      rows: 2,
      group: "main",
    }),
    defineField({
      name: "blurb_ar",
      title: "Short blurb (Arabic)",
      type: "text",
      rows: 2,
      group: "arabic",
    }),
    defineField({
      name: "description",
      title: "Description (English)",
      type: "text",
      rows: 5,
      group: "main",
    }),
    defineField({
      name: "description_ar",
      title: "Description (Arabic)",
      type: "text",
      rows: 5,
      group: "arabic",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "main",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "wood", media: "image", price: "price" },
    prepare({ title, subtitle, media, price }) {
      return {
        title,
        subtitle: [subtitle, price ? `JOD ${price}` : null].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
