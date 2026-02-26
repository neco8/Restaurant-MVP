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

test("findById returns product when it exists", async () => {
  const repository = createInMemoryProductRepository([
    { id: "1", name: "Ramen", price: price(8.0), description: "Broth" },
  ]);
  const product = await repository.findById("1");
  expect(product).toEqual({ id: "1", name: "Ramen", price: price(8.0), description: "Broth" });
});

test("findById returns null when product does not exist", async () => {
  const repository = createInMemoryProductRepository([]);
  const product = await repository.findById("nonexistent");
  expect(product).toBeNull();
});

test("update modifies product and returns updated version", async () => {
  const repository = createInMemoryProductRepository([
    { id: "1", name: "Ramen", price: price(8.0), description: "Broth" },
  ]);
  const updated = await repository.update("1", { name: "Spicy Ramen" });
  expect(updated.name).toBe("Spicy Ramen");
  expect(updated.price).toBe(price(8.0));

  const all = await repository.findAll();
  expect(all[0].name).toBe("Spicy Ramen");
});

test("delete removes product from store", async () => {
  const repository = createInMemoryProductRepository([
    { id: "1", name: "Ramen", price: price(8.0), description: "Broth" },
  ]);
  await repository.delete("1");
  const all = await repository.findAll();
  expect(all).toHaveLength(0);
});
