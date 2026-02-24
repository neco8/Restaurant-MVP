import type { Product, ProductRepository } from "./types";

export async function getProducts(
  repository: ProductRepository
): Promise<Product[]> {
  return repository.findAll();
}
