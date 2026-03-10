import { describe, test, expect, vi } from "vitest";
import { createOrder, type OrderRepository } from "./createOrder";
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
