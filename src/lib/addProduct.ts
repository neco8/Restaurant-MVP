import type { Price } from "./price";
import type { Product } from "./types";

export type CreateProductInput = {
  name: string;
  description: string;
  price: Price;
};

export type WritableProductRepository = {
  create: (input: CreateProductInput) => Promise<Product>;
};

export async function addProduct(
  repository: WritableProductRepository,
  input: CreateProductInput
): Promise<Product> {
  return repository.create(input);
}
