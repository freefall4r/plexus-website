import { defineType, defineField } from "sanity";

/**
 * Homepage content — edit the homepage text + section images here.
 * Anything left blank falls back to the built-in default copy/images, so the
 * site always renders. Create ONE "Homepage" document.
 */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "philosophy", title: "Our nature" },
    { name: "work", title: "Furniture & objects" },
    { name: "studio", title: "3D Studio" },
    { name: "research", title: "Wood research" },
    { name: "craft", title: "The craft" },
    { name: "contact", title: "Commissions" },
  ],
  fields: [
    // ---- HERO ----
    defineField({ name: "heroEyebrow_en", title: "Hero · Eyebrow (EN)", type: "string", group: "hero" }),
    defineField({ name: "heroEyebrow_ar", title: "Hero · Eyebrow (AR)", type: "string", group: "hero" }),
    defineField({ name: "heroLine1_en", title: "Hero · Headline line 1 (EN)", type: "string", group: "hero" }),
    defineField({ name: "heroLine1_ar", title: "Hero · Headline line 1 (AR)", type: "string", group: "hero" }),
    defineField({ name: "heroLine2_en", title: "Hero · Headline line 2 (EN)", type: "string", group: "hero" }),
    defineField({ name: "heroLine2_ar", title: "Hero · Headline line 2 (AR)", type: "string", group: "hero" }),
    defineField({ name: "heroSub_en", title: "Hero · Sub-text (EN)", type: "text", rows: 2, group: "hero" }),
    defineField({ name: "heroSub_ar", title: "Hero · Sub-text (AR)", type: "text", rows: 2, group: "hero" }),

    // ---- PHILOSOPHY ----
    defineField({ name: "philoEyebrow_en", title: "Eyebrow (EN)", type: "string", group: "philosophy" }),
    defineField({ name: "philoEyebrow_ar", title: "Eyebrow (AR)", type: "string", group: "philosophy" }),
    defineField({ name: "philoHeading_en", title: "Heading (EN)", type: "text", rows: 2, group: "philosophy" }),
    defineField({ name: "philoHeading_ar", title: "Heading (AR)", type: "text", rows: 2, group: "philosophy" }),
    defineField({ name: "philoP1_en", title: "Paragraph 1 (EN)", type: "text", rows: 3, group: "philosophy" }),
    defineField({ name: "philoP1_ar", title: "Paragraph 1 (AR)", type: "text", rows: 3, group: "philosophy" }),
    defineField({ name: "philoP2_en", title: "Paragraph 2 (EN)", type: "text", rows: 3, group: "philosophy" }),
    defineField({ name: "philoP2_ar", title: "Paragraph 2 (AR)", type: "text", rows: 3, group: "philosophy" }),
    defineField({ name: "philoImage", title: "Image", type: "image", group: "philosophy" }),

    // ---- WORK (furniture & objects gallery) ----
    defineField({ name: "workEyebrow_en", title: "Eyebrow (EN)", type: "string", group: "work" }),
    defineField({ name: "workEyebrow_ar", title: "Eyebrow (AR)", type: "string", group: "work" }),
    defineField({ name: "workHeading_en", title: "Heading (EN)", type: "string", group: "work" }),
    defineField({ name: "workHeading_ar", title: "Heading (AR)", type: "string", group: "work" }),
    defineField({
      name: "workItems",
      title: "Pieces (gallery)",
      type: "array",
      group: "work",
      of: [
        {
          type: "object",
          fields: [
            { name: "name_en", title: "Name (EN)", type: "string" },
            { name: "name_ar", title: "Name (AR)", type: "string" },
            { name: "material_en", title: "Material (EN)", type: "string" },
            { name: "material_ar", title: "Material (AR)", type: "string" },
            { name: "image", title: "Image", type: "image" },
          ],
          preview: { select: { title: "name_en", media: "image" } },
        },
      ],
    }),

    // ---- 3D STUDIO ----
    defineField({ name: "studioEyebrow_en", title: "Eyebrow (EN)", type: "string", group: "studio" }),
    defineField({ name: "studioEyebrow_ar", title: "Eyebrow (AR)", type: "string", group: "studio" }),
    defineField({ name: "studioHeading_en", title: "Heading (EN)", type: "text", rows: 2, group: "studio" }),
    defineField({ name: "studioHeading_ar", title: "Heading (AR)", type: "text", rows: 2, group: "studio" }),
    defineField({ name: "studioSub_en", title: "Sub-text (EN)", type: "text", rows: 3, group: "studio" }),
    defineField({ name: "studioSub_ar", title: "Sub-text (AR)", type: "text", rows: 3, group: "studio" }),

    // ---- RESEARCH ----
    defineField({ name: "researchEyebrow_en", title: "Eyebrow (EN)", type: "string", group: "research" }),
    defineField({ name: "researchEyebrow_ar", title: "Eyebrow (AR)", type: "string", group: "research" }),
    defineField({ name: "researchHeading_en", title: "Heading (EN)", type: "text", rows: 2, group: "research" }),
    defineField({ name: "researchHeading_ar", title: "Heading (AR)", type: "text", rows: 2, group: "research" }),
    defineField({ name: "researchIntro_en", title: "Intro (EN)", type: "text", rows: 3, group: "research" }),
    defineField({ name: "researchIntro_ar", title: "Intro (AR)", type: "text", rows: 3, group: "research" }),
    defineField({ name: "researchImage", title: "Image", type: "image", group: "research" }),

    // ---- CRAFT ----
    defineField({ name: "craftEyebrow_en", title: "Eyebrow (EN)", type: "string", group: "craft" }),
    defineField({ name: "craftEyebrow_ar", title: "Eyebrow (AR)", type: "string", group: "craft" }),
    defineField({ name: "craftStatement_en", title: "Statement (EN)", type: "text", rows: 2, group: "craft" }),
    defineField({ name: "craftStatement_ar", title: "Statement (AR)", type: "text", rows: 2, group: "craft" }),
    defineField({ name: "craftOverlay_en", title: "Image caption (EN)", type: "string", group: "craft" }),
    defineField({ name: "craftOverlay_ar", title: "Image caption (AR)", type: "string", group: "craft" }),
    defineField({ name: "craftImage", title: "Image", type: "image", group: "craft" }),

    // ---- CONTACT ----
    defineField({ name: "contactEyebrow_en", title: "Eyebrow (EN)", type: "string", group: "contact" }),
    defineField({ name: "contactEyebrow_ar", title: "Eyebrow (AR)", type: "string", group: "contact" }),
    defineField({ name: "contactHeading_en", title: "Heading (EN)", type: "string", group: "contact" }),
    defineField({ name: "contactHeading_ar", title: "Heading (AR)", type: "string", group: "contact" }),
    defineField({ name: "contactP_en", title: "Paragraph (EN)", type: "text", rows: 2, group: "contact" }),
    defineField({ name: "contactP_ar", title: "Paragraph (AR)", type: "text", rows: 2, group: "contact" }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
