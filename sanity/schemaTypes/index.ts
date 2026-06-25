import { type SchemaTypeDefinition } from "sanity";
import { product } from "./product";
import { homepage } from "./homepage";
import { testimonial } from "./testimonial";
import { fabricationExample } from "./fabricationExample";
import { fabricationTemplate } from "./fabricationTemplate";
import { woodEntry } from "./woodEntry";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product,
    homepage,
    testimonial,
    fabricationExample,
    fabricationTemplate,
    woodEntry,
  ],
};
