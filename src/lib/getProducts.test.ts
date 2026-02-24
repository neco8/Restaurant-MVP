import { getProducts } from "./getProducts";

test("returns empty list when repository has no products", async () => {
  const repository = { findAll: async () => [] as never[] };
  const result = await getProducts(repository);
  expect(result).toEqual([]);
});
