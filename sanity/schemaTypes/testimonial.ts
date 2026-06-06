import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Client name (English)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "name_ar", title: "Client name (Arabic)", type: "string" }),
    defineField({
      name: "role",
      title: "Role / business (English)",
      type: "string",
      description: 'e.g. "Owner · Rumi Café" or "Interior designer"',
    }),
    defineField({ name: "role_ar", title: "Role / business (Arabic)", type: "string" }),
    defineField({
      name: "quote",
      title: "Quote (English)",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({ name: "quote_ar", title: "Quote (Arabic)", type: "text", rows: 4 }),
    defineField({
      name: "order",
      title: "Sort order (lower shows first)",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
