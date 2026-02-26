import type { Product, ProductRepository } from "./types";

export async function getProducts(
  repository: Pick<ProductRepository, "findAll">
): Promise<Product[]> {
  return repository.findAll();
}
