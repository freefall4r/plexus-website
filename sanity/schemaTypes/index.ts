import { type SchemaTypeDefinition } from "sanity";
import { product } from "./product";
import { homepage } from "./homepage";
import { testimonial } from "./testimonial";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, homepage, testimonial],
};
