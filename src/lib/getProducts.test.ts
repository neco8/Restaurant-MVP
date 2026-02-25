import { getProducts } from "./getProducts";

test("returns empty list when repository has no products", async () => {
  const repository = { findAll: async () => [] as never[] };
  const result = await getProducts(repository);
  expect(result).toEqual([]);
});

test("returns products from repository", async () => {
  const repository = {
    findAll: async () => [
      { id: "1", name: "Ramen", price: 8.00, description: "Rich tonkotsu broth" },
    ],
  };
  const result = await getProducts(repository);
  expect(result).toEqual([
    { id: "1", name: "Ramen", price: 8.00, description: "Rich tonkotsu broth" },
  ]);
});
