import { GET } from "./route";

vi.mock("@/server/prismaClient", () => ({
  prisma: {
    order: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/prismaClient";

const mockFindMany = vi.mocked(prisma.order.findMany);
const mockCount = vi.mocked(prisma.order.count);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/admin/orders", () => {
  test("returns orders in normalized shape with totalCount without limit", async () => {
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
    mockCount.mockResolvedValue(1);

    const res = await GET(new Request("http://localhost:3000/api/admin/orders"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      orders: [
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
      ],
      totalCount: 1,
    });
  });

  test("returns empty orders array with zero totalCount when no orders", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const res = await GET(new Request("http://localhost:3000/api/admin/orders"));
    const data = await res.json();

    expect(data).toEqual({ orders: [], totalCount: 0 });
  });

  test("respects limit query parameter and includes totalCount", async () => {
    const sevenOrders = [
      {
        id: "o1",
        status: "pending" as const,
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
        ],
      },
      {
        id: "o2",
        status: "pending" as const,
        total: 1500,
        createdAt: new Date("2026-01-14T10:00:00.000Z"),
        updatedAt: new Date(),
        items: [
          {
            id: "i2",
            quantity: 2,
            price: 750,
            productId: "p2",
            orderId: "o2",
            product: { id: "p2", name: "Gyoza", description: "", price: 750, image: "", createdAt: new Date(), updatedAt: new Date() },
          },
        ],
      },
      {
        id: "o3",
        status: "completed" as const,
        total: 3000,
        createdAt: new Date("2026-01-13T10:00:00.000Z"),
        updatedAt: new Date(),
        items: [
          {
            id: "i3",
            quantity: 1,
            price: 3000,
            productId: "p3",
            orderId: "o3",
            product: { id: "p3", name: "Katsu", description: "", price: 3000, image: "", createdAt: new Date(), updatedAt: new Date() },
          },
        ],
      },
      {
        id: "o4",
        status: "pending" as const,
        total: 2000,
        createdAt: new Date("2026-01-12T10:00:00.000Z"),
        updatedAt: new Date(),
        items: [
          {
            id: "i4",
            quantity: 1,
            price: 2000,
            productId: "p4",
            orderId: "o4",
            product: { id: "p4", name: "Tempura", description: "", price: 2000, image: "", createdAt: new Date(), updatedAt: new Date() },
          },
        ],
      },
      {
        id: "o5",
        status: "pending" as const,
        total: 1800,
        createdAt: new Date("2026-01-11T10:00:00.000Z"),
        updatedAt: new Date(),
        items: [
          {
            id: "i5",
            quantity: 1,
            price: 1800,
            productId: "p5",
            orderId: "o5",
            product: { id: "p5", name: "Udon", description: "", price: 1800, image: "", createdAt: new Date(), updatedAt: new Date() },
          },
        ],
      },
      {
        id: "o6",
        status: "pending" as const,
        total: 2200,
        createdAt: new Date("2026-01-10T10:00:00.000Z"),
        updatedAt: new Date(),
        items: [
          {
            id: "i6",
            quantity: 1,
            price: 2200,
            productId: "p6",
            orderId: "o6",
            product: { id: "p6", name: "Tonkotsu", description: "", price: 2200, image: "", createdAt: new Date(), updatedAt: new Date() },
          },
        ],
      },
      {
        id: "o7",
        status: "pending" as const,
        total: 1600,
        createdAt: new Date("2026-01-09T10:00:00.000Z"),
        updatedAt: new Date(),
        items: [
          {
            id: "i7",
            quantity: 1,
            price: 1600,
            productId: "p7",
            orderId: "o7",
            product: { id: "p7", name: "Miso", description: "", price: 1600, image: "", createdAt: new Date(), updatedAt: new Date() },
          },
        ],
      },
    ] as never[];

    mockFindMany.mockResolvedValue(sevenOrders.slice(0, 5));
    mockCount.mockResolvedValue(7);

    const request = new Request("http://localhost:3000/api/admin/orders?limit=5");
    const res = await GET(request);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.orders).toHaveLength(5);
    expect(data.totalCount).toBe(7);
  });
});
