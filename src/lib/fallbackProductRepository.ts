import type { ProductRepository } from "./types";

export function createFallbackProductRepository(
  primary: ProductRepository,
  fallback: ProductRepository
): ProductRepository {
  return {
    findAll: async () => {
      try {
        return await primary.findAll();
      } catch {
        return fallback.findAll();
      }
    },
  };
}
