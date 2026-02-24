import type { Product, ProductRepository } from "./types";

export function createInMemoryProductRepository(
  products: Product[]
): ProductRepository {
  return {
    findAll: async () => products,
  };
}
