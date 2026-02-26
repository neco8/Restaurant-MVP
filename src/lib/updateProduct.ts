import type { Product, ProductRepository, UpdateProductInput } from "./types";

export async function updateProduct(
  repository: Pick<ProductRepository, "update">,
  id: string,
  input: UpdateProductInput
): Promise<Product> {
  return repository.update(id, input);
}
