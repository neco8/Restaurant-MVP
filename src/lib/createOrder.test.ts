import { createOrder } from "./createOrder";
import type { OrderRepository } from "./types";
import { price } from "./price";
import { quantity } from "./quantity";

describe("createOrder", () => {
  test("should return an order with pending status", async () => {
    const repository: OrderRepository = {
      save: vi.fn().mockResolvedValue({
        id: "order-1",
        status: "pending",
        total: price(9.99),
        items: [
          {
            productId: "product-1",
            quantity: quantity(1)._unsafeUnwrap(),
            price: price(9.99),
          },
        ],
      }),
      count: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      updateStatus: vi.fn(),
    };

    const order = await createOrder(
      [
        {
          productId: "product-1",
          quantity: quantity(1)._unsafeUnwrap(),
          price: price(9.99),
        },
      ],
      repository,
    );

    expect(order.status).toBe("pending");
  });
});
