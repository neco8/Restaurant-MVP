import type { Product } from "./types";

export type ProductRepository = {
  findAll: () => Promise<Product[]>;
};

export async function getProducts(
  _repository: ProductRepository
): Promise<Product[]> {
  return [];
}
