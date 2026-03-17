import { describe, test, expect, beforeEach } from "vitest";
import { price } from "@/lib/price";
import { quantity } from "@/lib/quantity";

const mockSave = vi.fn();
vi.mock("@/server/orderRepository", () => ({
  defaultOrderRepository: () => ({ save: mockSave }),
}));

describe("POST /api/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSave.mockResolvedValue({
      id: "order-1",
      status: "pending",
      total: price(27.00),
      items: [
        { productId: "p1", quantity: quantity(2)._unsafeUnwrap(), price: price(12.00) },
        { productId: "p2", quantity: quantity(1)._unsafeUnwrap(), price: price(3.00) },
      ],
    });
  });

  test("creates an order and returns 201 with order data in cents", async () => {
    const { POST } = await import("./route");

    const request = new Request("http://localhost/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          { productId: "p1", quantity: 2, price: 1200 },
          { productId: "p2", quantity: 1, price: 300 },
        ],
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      id: "order-1",
      status: "pending",
      total: 2700,
      items: [
        { productId: "p1", quantity: 2, price: 1200 },
        { productId: "p2", quantity: 1, price: 300 },
      ],
    });
  });
});
