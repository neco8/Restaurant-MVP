import type { Product } from "./types";

export type ProductRepository = {
  findAll: () => Promise<Product[]>;
};

export async function getProducts(
  repository: ProductRepository
): Promise<Product[]> {
  return repository.findAll();
}
