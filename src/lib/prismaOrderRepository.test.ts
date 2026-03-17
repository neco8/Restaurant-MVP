import { createPrismaOrderRepository } from "./prismaOrderRepository";
import { price } from "./price";
import { quantity } from "./quantity";
import type { OrderItem } from "./types";

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

describe("PrismaOrderRepository", () => {
  test("findAll returns orders with item details including product name", async () => {
    const mockFindMany = vi.fn().mockResolvedValue([
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
            product: { id: "p1", name: "Ramen" },
          },
        ],
      },
    ]);
    const mockPrisma = {
      order: {
        create: vi.fn(),
        count: vi.fn(),
        findMany: mockFindMany,
      },
    };
    const repository = createPrismaOrderRepository(mockPrisma);
    const orders = await repository.findAll();
    expect(orders).toEqual([
      {
        id: "o1",
        status: "pending",
        total: price(27.0),
        createdAt: new Date("2026-01-15T10:00:00.000Z"),
        items: [
          {
            id: "i1",
            productName: "Ramen",
            quantity: quantity(1)._unsafeUnwrap(),
            price: price(12.0),
          },
        ],
      },
    ]);
  });

  test("findById returns order status when found", async () => {
    const mockFindUnique = vi.fn().mockResolvedValue({
      id: "o1",
      status: "pending",
      total: 2700,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const mockPrisma = {
      order: {
        create: vi.fn(),
        count: vi.fn(),
        findMany: vi.fn(),
        findUnique: mockFindUnique,
      },
    };
    const repository = createPrismaOrderRepository(mockPrisma);
    const order = await repository.findById("o1");
    expect(order).toEqual({ id: "o1", status: "pending" });
  });

  test("findById returns null when order not found", async () => {
    const mockPrisma = {
      order: {
        create: vi.fn(),
        count: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };
    const repository = createPrismaOrderRepository(mockPrisma);
    const order = await repository.findById("nonexistent");
    expect(order).toBeNull();
  });

  test("findAll respects limit option", async () => {
    const mockFindMany = vi.fn().mockResolvedValue([]);
    const mockPrisma = {
      order: {
        create: vi.fn(),
        count: vi.fn(),
        findMany: mockFindMany,
      },
    };
    const repository = createPrismaOrderRepository(mockPrisma);
    await repository.findAll({ limit: 5 });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
  });

  test("count returns the total number of orders", async () => {
    const mockCount = vi.fn().mockResolvedValue(5);
    const mockPrisma = {
      order: {
        create: vi.fn(),
        count: mockCount,
      },
    };
    const repository = createPrismaOrderRepository(mockPrisma);
    const total = await repository.count();
    expect(total).toBe(5);
  });

  test("save should create an order with items in the database", async () => {
    const items: OrderItem[] = [
      { productId: "p1", quantity: quantity(2)._unsafeUnwrap(), price: price(12.5) },
    ];

    mockCreate.mockResolvedValue({
      id: "order-1",
      status: "pending",
      total: 2500,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: "item-1",
          quantity: 2,
          price: 1250,
          productId: "p1",
          orderId: "order-1",
        },
      ],
    } as never);

    const repository = createPrismaOrderRepository(prisma);
    const order = await repository.save(items);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        status: "pending",
        total: 2500,
        items: {
          create: [
            { productId: "p1", quantity: 2, price: 1250 },
          ],
        },
      },
      include: { items: true },
    });

    expect(order).toEqual({
      id: "order-1",
      status: "pending",
      total: 25,
      items: [
        { productId: "p1", quantity: 2, price: 12.5 },
      ],
    });
  });
});
