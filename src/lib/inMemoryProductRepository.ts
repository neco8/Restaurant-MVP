import type { Product, ProductRepository } from "./types";

let nextId = 1;

export function createInMemoryProductRepository(
  products: Product[]
): ProductRepository {
  const store = [...products];
  return {
    findAll: async () => [...store],
    findById: async (id) => store.find((p) => p.id === id) ?? null,
    create: async (input) => {
      const product: Product = {
        id: String(nextId++),
        ...input,
      };
      store.push(product);
      return product;
    },
    update: async (id, input) => {
      const index = store.findIndex((p) => p.id === id);
      if (index === -1) throw new Error(`Product not found: ${id}`);
      store[index] = { ...store[index], ...input };
      return store[index];
    },
    delete: async (id) => {
      const index = store.findIndex((p) => p.id === id);
      if (index === -1) throw new Error(`Product not found: ${id}`);
      store.splice(index, 1);
    },
  };
}
