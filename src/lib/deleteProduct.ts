import type { ProductRepository } from "./types";

export async function deleteProduct(
  repository: Pick<ProductRepository, "delete">,
  id: string
): Promise<void> {
  await repository.delete(id);
}
