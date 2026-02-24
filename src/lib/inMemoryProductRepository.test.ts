import { createInMemoryProductRepository } from "./inMemoryProductRepository";

test("findAll returns stored products", async () => {
  const repository = createInMemoryProductRepository([
    { id: "1", name: "Ramen", price: 800, description: "Rich tonkotsu broth" },
  ]);
  const products = await repository.findAll();
  expect(products).toEqual([
    { id: "1", name: "Ramen", price: 800, description: "Rich tonkotsu broth" },
  ]);
});
