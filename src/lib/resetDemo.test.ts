import { price } from "./price";
import { resetDemo } from "./resetDemo";
import { createInMemoryProductRepository } from "./inMemoryProductRepository";

describe("resetDemo", () => {
  test("replaces existing products with demo seed data", async () => {
    const productRepository = createInMemoryProductRepository([
      { id: "old-1", name: "Old Item", price: price(5), description: "should be deleted" },
    ]);

    await resetDemo({ productRepository });

    const products = await productRepository.findAll();
    const names = products.map((p) => p.name);
    expect(names).not.toContain("Old Item");
    expect(products.length).toBeGreaterThan(0);
  });
});
