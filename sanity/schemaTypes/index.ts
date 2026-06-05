import { type SchemaTypeDefinition } from "sanity";
import { product } from "./product";
import { homepage } from "./homepage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, homepage],
};
