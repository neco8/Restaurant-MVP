import { price } from "./price";
import type { ProductRepository } from "./types";

const DEMO_PRODUCTS = [
  { name: "Tonkotsu Ramen", price: price(12.0), description: "Rich pork bone broth with chashu, egg, and nori" },
  { name: "Gyoza (6pc)", price: price(7.5), description: "Pan-fried pork and vegetable dumplings" },
  { name: "Karaage", price: price(9.0), description: "Japanese fried chicken with yuzu mayo" },
];

export async function resetDemo(deps: {
  productRepository: ProductRepository;
}): Promise<void> {
  const existing = await deps.productRepository.findAll();
  for (const product of existing) {
    await deps.productRepository.delete(product.id);
  }
  for (const seed of DEMO_PRODUCTS) {
    await deps.productRepository.create(seed);
  }
}
