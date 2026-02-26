import type { CreateProductInput, Product, ProductRepository } from "./types";

export async function addProduct(
  repository: Pick<ProductRepository, "create">,
  input: CreateProductInput
): Promise<Product> {
  return repository.create(input);
}
