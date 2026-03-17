import { createInMemoryProductRepository } from "./inMemoryProductRepository";
import { price } from "./price";

test("findById returns product when found", async () => {
  const repository = createInMemoryProductRepository([
    { id: "1", name: "Ramen", price: price(8.0), description: "Rich broth" },
  ]);
  const product = await repository.findById("1");
  expect(product).toEqual({
    id: "1",
    name: "Ramen",
    price: price(8.0),
    description: "Rich broth",
  });
});

test("findById returns null when not found", async () => {
  const repository = createInMemoryProductRepository([]);
  const product = await repository.findById("nonexistent");
  expect(product).toBeNull();
});

test("create adds a product and returns it with generated id", async () => {
  const repository = createInMemoryProductRepository([]);
  const product = await repository.create({
    name: "Gyoza",
    description: "Dumplings",
    price: price(7.5),
  });
  expect(product.name).toBe("Gyoza");
  expect(product.price).toEqual(price(7.5));
  expect(product.id).toBeDefined();

  const all = await repository.findAll();
  expect(all).toHaveLength(1);
});

test("update modifies an existing product", async () => {
  const repository = createInMemoryProductRepository([
    { id: "1", name: "Ramen", price: price(8.0), description: "Old" },
  ]);
  const updated = await repository.update("1", {
    name: "New Ramen",
    description: "New",
    price: price(10.0),
  });
  expect(updated).toEqual({
    id: "1",
    name: "New Ramen",
    description: "New",
    price: price(10.0),
  });
});

test("delete removes a product", async () => {
  const repository = createInMemoryProductRepository([
    { id: "1", name: "Ramen", price: price(8.0), description: "Broth" },
  ]);
  await repository.delete("1");
  const all = await repository.findAll();
  expect(all).toHaveLength(0);
});

test("findAll returns stored products", async () => {
  const repository = createInMemoryProductRepository([
    { id: "1", name: "Ramen", price: price(8.00), description: "Rich tonkotsu broth" },
  ]);
  const products = await repository.findAll();
  expect(products).toEqual([
    { id: "1", name: "Ramen", price: price(8.00), description: "Rich tonkotsu broth" },
  ]);
});
