import type { Product, ProductRepository } from "./types";

let nextId = 1;

export function createInMemoryProductRepository(
  products: Product[]
): ProductRepository {
  const store = [...products];
  return {
    findAll: async () => [...store],
    create: async (input) => {
      const product: Product = {
        id: String(nextId++),
        ...input,
      };
      store.push(product);
      return product;
    },
  };
}
