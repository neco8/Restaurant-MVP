import type { Price } from "./price";
import type { Product, ProductRepository } from "./types";

export function createInMemoryProductRepository(
  products: Product[]
): ProductRepository {
  return {
    findAll: async () => products,
    findById: async (id: string) => products.find((p) => p.id === id) ?? null,
    create: async (input: { name: string; description: string; price: Price }) => {
      const product: Product = { id: crypto.randomUUID(), ...input };
      products.push(product);
      return product;
    },
    update: async (id: string, input: { name: string; description: string; price: Price }) => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) throw new Error(`Product not found: ${id}`);
      products[index] = { ...products[index], ...input };
      return products[index];
    },
    delete: async (id: string) => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return;
      products.splice(index, 1);
    },
  };
}
