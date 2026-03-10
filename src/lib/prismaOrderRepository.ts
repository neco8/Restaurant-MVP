import type { OrderItem, Order, OrderRepository } from "./types";
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
};

export type PrismaOrderLike = {
  order: PrismaOrderDelegate;
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
  };
}
