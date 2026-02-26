import { createFallbackProductRepository } from "./fallbackProductRepository";
import { price } from "./price";
import type { ProductRepository } from "./types";

const fallbackProducts = [
  { id: "1", name: "Ramen", price: price(12.0), description: "Rich tonkotsu broth" },
];

test("findAll returns products from primary when it succeeds", async () => {
  const primary: ProductRepository = {
    findAll: async () => [
      { id: "db1", name: "DB Ramen", price: price(15.0), description: "From database" },
    ],
  };
  const fallback: ProductRepository = { findAll: async () => fallbackProducts };
  const repository = createFallbackProductRepository(primary, fallback);
  const products = await repository.findAll();
  expect(products).toEqual([
    { id: "db1", name: "DB Ramen", price: price(15.0), description: "From database" },
  ]);
});

test("findAll returns fallback products when primary throws", async () => {
  const primary: ProductRepository = {
    findAll: async () => {
      throw new Error("DB connection failed");
    },
  };
  const fallback: ProductRepository = { findAll: async () => fallbackProducts };
  const repository = createFallbackProductRepository(primary, fallback);
  const products = await repository.findAll();
  expect(products).toEqual(fallbackProducts);
});
