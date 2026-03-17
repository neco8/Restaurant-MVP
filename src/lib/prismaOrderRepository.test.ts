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
