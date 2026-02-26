import { getProducts } from "./getProducts";
import { price } from "./price";

test("returns empty list when repository has no products", async () => {
  const repository = { findAll: async () => [] };
  const result = await getProducts(repository);
  expect(result).toEqual([]);
});

test("returns products from repository", async () => {
  const repository = {
    findAll: async () => [
      { id: "1", name: "Ramen", price: price(8.00), description: "Rich tonkotsu broth" },
    ],
  };
  const result = await getProducts(repository);
  expect(result).toEqual([
    { id: "1", name: "Ramen", price: price(8.00), description: "Rich tonkotsu broth" },
  ]);
});
