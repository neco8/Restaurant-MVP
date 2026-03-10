import type { OrderItem, Order, OrderRepository } from "./types";
import { dollarsToCents, centsToDollars } from "./currency";
import { orderTotal } from "./totals";
import { price } from "./price";
import type { Quantity } from "./quantity";

type PrismaOrderDelegate = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (args: any) => Promise<any>;
};

type PrismaLike = {
  order: PrismaOrderDelegate;
};

export function createPrismaOrderRepository(
  prisma: PrismaLike
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
        items: result.items.map((item: { productId: string; quantity: number; price: number }) => ({
          productId: item.productId,
          quantity: item.quantity as Quantity,
          price: price(centsToDollars(item.price)),
        })),
      };
    },
  };
}
