import { createInMemoryOrderRepository } from "./inMemoryOrderRepository";
import { price } from "./price";
import { quantity } from "./quantity";
import type { OrderItem } from "./types";

test("save creates an order and returns it", async () => {
  const repository = createInMemoryOrderRepository();
  const items: OrderItem[] = [
    { productId: "p1", quantity: quantity(2)._unsafeUnwrap(), price: price(12.0) },
  ];
  const order = await repository.save(items);
  expect(order.id).toBeDefined();
  expect(order.status).toBe("pending");
  expect(order.items).toEqual(items);
});

test("count returns 0 when empty", async () => {
  const repository = createInMemoryOrderRepository();
  expect(await repository.count()).toBe(0);
});

test("count returns number of saved orders", async () => {
  const repository = createInMemoryOrderRepository();
  await repository.save([
    { productId: "p1", quantity: quantity(1)._unsafeUnwrap(), price: price(10.0) },
  ]);
  await repository.save([
    { productId: "p2", quantity: quantity(1)._unsafeUnwrap(), price: price(5.0) },
  ]);
  expect(await repository.count()).toBe(2);
});

test("findById returns order when found", async () => {
  const repository = createInMemoryOrderRepository();
  const items: OrderItem[] = [
    { productId: "p1", quantity: quantity(1)._unsafeUnwrap(), price: price(10.0) },
  ];
  const saved = await repository.save(items);
  const found = await repository.findById(saved.id);
  expect(found).toEqual({ id: saved.id, status: "pending" });
});

test("findById returns null when not found", async () => {
  const repository = createInMemoryOrderRepository();
  expect(await repository.findById("nonexistent")).toBeNull();
});

test("updateStatus changes the order status", async () => {
  const repository = createInMemoryOrderRepository();
  const items: OrderItem[] = [
    { productId: "p1", quantity: quantity(1)._unsafeUnwrap(), price: price(10.0) },
  ];
  const saved = await repository.save(items);
  const updated = await repository.updateStatus(saved.id, "preparing");
  expect(updated).toEqual({ id: saved.id, status: "preparing" });
});

test("deleteAll removes all orders", async () => {
  const repository = createInMemoryOrderRepository();
  await repository.save([
    { productId: "p1", quantity: quantity(1)._unsafeUnwrap(), price: price(10.0) },
  ]);
  await repository.save([
    { productId: "p2", quantity: quantity(1)._unsafeUnwrap(), price: price(5.0) },
  ]);
  await repository.deleteAll();
  expect(await repository.count()).toBe(0);
});

test("findAll returns orders with item details", async () => {
  const repository = createInMemoryOrderRepository(
    new Map([["p1", "Ramen"]])
  );
  await repository.save([
    { productId: "p1", quantity: quantity(2)._unsafeUnwrap(), price: price(12.0) },
  ]);
  const orders = await repository.findAll();
  expect(orders).toHaveLength(1);
  expect(orders[0].items[0].productName).toBe("Ramen");
});
