import type { OrderItem, Order, OrderRepository, DetailedOrder, OrderSummary } from "./types";
import { dollarsToCents, centsToDollars } from "./currency";
import { orderTotal } from "./totals";
import { price } from "./price";
import { quantity } from "./quantity";

export type PrismaOrderItemRow = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  orderId: string;
};

export type PrismaOrderRow = {
  id: string;
  status: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: PrismaOrderItemRow[];
};

type PrismaOrderWithItemsRow = {
  id: string;
  status: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: (PrismaOrderItemRow & { product: { id: string; name: string } })[];
};

export type PrismaOrderDelegate = {
  create: (args: {
    data: {
      status: string;
      total: number;
      items: {
        create: { productId: string; quantity: number; price: number }[];
      };
    };
    include: { items: true };
  }) => Promise<PrismaOrderRow>;
  count: () => Promise<number>;
  findMany: (args: {
    include: { items: { include: { product: true } } };
    orderBy: { createdAt: "desc" };
    take?: number;
  }) => Promise<PrismaOrderWithItemsRow[]>;
  findUnique: (args: { where: { id: string } }) => Promise<{ id: string; status: string; total: number; createdAt: Date; updatedAt: Date } | null>;
  update: (args: { where: { id: string }; data: { status: string } }) => Promise<{ id: string; status: string; total: number; createdAt: Date; updatedAt: Date }>;
  deleteMany: () => Promise<{ count: number }>;
};

export type PrismaOrderItemDelegate = {
  deleteMany: () => Promise<{ count: number }>;
};

export type PrismaOrderLike = {
  order: PrismaOrderDelegate;
  orderItem: PrismaOrderItemDelegate;
};

export function createPrismaOrderRepository(
  prisma: PrismaOrderLike
): OrderRepository {
  return {
    save: async (items: OrderItem[]): Promise<Order> => {
      const totalDollars = orderTotal(items);

      const result = await prisma.order.create({
        data: {
          status: "pending",
          total: dollarsToCents(totalDollars),
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: dollarsToCents(item.price),
            })),
          },
        },
        include: { items: true },
      });

      return {
        id: result.id,
        status: result.status,
        total: price(centsToDollars(result.total)),
        items: result.items.map((item) => ({
          productId: item.productId,
          quantity: quantity(item.quantity)._unsafeUnwrap(),
          price: price(centsToDollars(item.price)),
        })),
      };
    },
    count: () => prisma.order.count(),
    findById: async (id: string): Promise<OrderSummary | null> => {
      const result = await prisma.order.findUnique({ where: { id } });
      if (!result) return null;
      return { id: result.id, status: result.status };
    },
    updateStatus: async (id: string, status: string): Promise<OrderSummary> => {
      const result = await prisma.order.update({ where: { id }, data: { status } });
      return { id: result.id, status: result.status };
    },
    deleteAll: async (): Promise<void> => {
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();
    },
    findAll: async (options?: { limit?: number }): Promise<DetailedOrder[]> => {
      const rows = await prisma.order.findMany({
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
        ...(options?.limit ? { take: options.limit } : {}),
      });
      return rows.map((row) => ({
        id: row.id,
        status: row.status,
        total: price(centsToDollars(row.total)),
        createdAt: row.createdAt,
        items: row.items.map((item) => ({
          id: item.id,
          productName: item.product.name,
          quantity: quantity(item.quantity)._unsafeUnwrap(),
          price: price(centsToDollars(item.price)),
        })),
      }));
    },
  };
}
