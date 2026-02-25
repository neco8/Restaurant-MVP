import { createInMemoryProductRepository } from "./inMemoryProductRepository";
import type { ProductRepository } from "./types";

const DEFAULT_PRODUCTS = [
  { id: "1", name: "Ramen", price: 12.00, description: "Rich tonkotsu broth with chashu pork" },
  { id: "2", name: "Gyoza", price: 7.50, description: "Pan-fried pork dumplings" },
  { id: "3", name: "Takoyaki", price: 8.00, description: "Octopus balls with bonito flakes" },
];

export function defaultProductRepository(): ProductRepository {
  return createInMemoryProductRepository(DEFAULT_PRODUCTS);
}
