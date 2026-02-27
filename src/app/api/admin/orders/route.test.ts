import { GET } from "./route";

vi.mock("@/server/prismaClient", () => ({
  prisma: {
    order: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/prismaClient";

const mockFindMany = vi.mocked(prisma.order.findMany);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/admin/orders", () => {
  test("returns all orders with items and prices in dollars", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "o1",
        status: "pending",
        total: 2700,
        createdAt: new Date("2026-01-15T10:00:00.000Z"),
        updatedAt: new Date(),
        items: [
          {
            id: "i1",
            quantity: 1,
            price: 1200,
            productId: "p1",
            orderId: "o1",
            product: { id: "p1", name: "Ramen", description: "", price: 1200, image: "", createdAt: new Date(), updatedAt: new Date() },
          },
          {
            id: "i2",
            quantity: 2,
            price: 750,
            productId: "p2",
            orderId: "o1",
            product: { id: "p2", name: "Gyoza", description: "", price: 750, image: "", createdAt: new Date(), updatedAt: new Date() },
          },
        ],
      },
    ] as never);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([
      {
        id: "o1",
        status: "pending",
        total: 27,
        createdAt: "2026-01-15T10:00:00.000Z",
        items: [
          { id: "i1", productName: "Ramen", quantity: 1, price: 12 },
          { id: "i2", productName: "Gyoza", quantity: 2, price: 7.5 },
        ],
      },
    ]);
  });

  test("returns empty array when no orders", async () => {
    mockFindMany.mockResolvedValue([]);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual([]);
  });
});
