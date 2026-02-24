import { createInMemoryProductRepository } from "./inMemoryProductRepository";
import { price } from "./price";

test("findAll returns stored products", async () => {
  const repository = createInMemoryProductRepository([
    { id: "1", name: "Ramen", price: price(8.00), description: "Rich tonkotsu broth" },
  ]);
  const products = await repository.findAll();
  expect(products).toEqual([
    { id: "1", name: "Ramen", price: price(8.00), description: "Rich tonkotsu broth" },
  ]);
});
