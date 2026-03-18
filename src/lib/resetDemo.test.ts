import { price } from "./price";
import { quantity } from "./quantity";
import { resetDemo } from "./resetDemo";
import { createInMemoryProductRepository } from "./inMemoryProductRepository";
import { createInMemoryOrderRepository } from "./inMemoryOrderRepository";

describe("resetDemo", () => {
  test("replaces existing products with demo seed data", async () => {
    const productRepository = createInMemoryProductRepository([
      { id: "old-1", name: "Old Item", price: price(5), description: "should be deleted" },
    ]);
    const orderRepository = createInMemoryOrderRepository();

    await resetDemo({ productRepository, orderRepository });

    const products = await productRepository.findAll();
    const names = products.map((p) => p.name);
    expect(names).not.toContain("Old Item");
    expect(products.length).toBeGreaterThan(0);
  });

  test("deletes all existing orders", async () => {
    const productRepository = createInMemoryProductRepository([]);
    const orderRepository = createInMemoryOrderRepository();
    await orderRepository.save([
      { productId: "p1", quantity: quantity(1)._unsafeUnwrap(), price: price(10) },
    ]);

    await resetDemo({ productRepository, orderRepository });

    expect(await orderRepository.count()).toBe(0);
  });
});
