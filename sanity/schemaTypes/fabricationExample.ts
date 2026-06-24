import { defineType, defineField } from "sanity";

// Gallery items for the /fabrication landing page — "what you can make".
// anahata adds these in /studio; they show under the CNC / Laser tabs.
export const fabricationExample = defineType({
  name: "fabricationExample",
  title: "Fabrication Example",
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
      name: "material",
      title: "Material (English)",
      type: "string",
      group: "main",
      description: "e.g. Birch plywood, 9mm",
    }),
    defineField({
      name: "material_ar",
      title: "Material (Arabic)",
      type: "string",
      group: "arabic",
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
