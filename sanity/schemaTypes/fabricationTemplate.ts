import { defineType, defineField } from "sanity";

// Ready designs a client can order from (lids, trays, …). Pricing is always
// "quote after request" (spec §9), so there is no price field. The template's
// slug is stored on the order as templateId.
export const fabricationTemplate = defineType({
  name: "fabricationTemplate",
  title: "Fabrication Template (ready design)",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "arabic", title: "العربية (Arabic)" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title (English)",
      type: "string",
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title_ar",
      title: "Title (Arabic)",
      type: "string",
      group: "arabic",
    }),
    defineField({
      name: "slug",
      title: "Slug (id)",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "service",
      title: "Service",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "CNC", value: "cnc" },
          { title: "Laser", value: "laser" },
          { title: "Milling & turning", value: "milling" },
        ],
        layout: "radio",
      },
      initialValue: "cnc",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "main",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Short description (English)",
      type: "text",
      rows: 2,
      group: "main",
    }),
    defineField({
      name: "description_ar",
      title: "Short description (Arabic)",
      type: "text",
      rows: 2,
      group: "arabic",
    }),
    defineField({
      name: "defaultMaterial",
      title: "Suggested material",
      type: "string",
      group: "main",
      description: "Prefilled in the order form; client can change it.",
    }),
    defineField({
      name: "defaultThickness",
      title: "Suggested thickness",
      type: "string",
      group: "main",
      description: 'e.g. "9mm"',
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      group: "main",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "service", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: (subtitle || "").toUpperCase(), media };
    },
  },
});
