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

test("create adds product and returns it with generated id", async () => {
  const repository = createInMemoryProductRepository([]);
  const created = await repository.create({
    name: "Udon",
    description: "Thick noodles",
    price: price(10.0),
  });
  expect(created.name).toBe("Udon");
  expect(created.description).toBe("Thick noodles");
  expect(created.price).toBe(price(10.0));
  expect(created.id).toBeDefined();

  const all = await repository.findAll();
  expect(all).toHaveLength(1);
  expect(all[0].name).toBe("Udon");
});
