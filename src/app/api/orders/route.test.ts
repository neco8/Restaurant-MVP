import { POST } from "./route";

vi.mock("@/server/prismaClient", () => ({
  prisma: {
    order: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/prismaClient";

const mockCreate = vi.mocked(prisma.order.create);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/orders", () => {
  test("creates an order and returns 201 with order data in cents", async () => {
    mockCreate.mockResolvedValue({
      id: "order-1",
      status: "pending",
      total: 2700,
      items: [
        { productId: "p1", quantity: 2, price: 1200 },
        { productId: "p2", quantity: 1, price: 300 },
      ],
    } as never);

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
