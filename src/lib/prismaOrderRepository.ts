import type { OrderItem, Order, OrderRepository } from "./createOrder";

type PrismaOrderDelegate = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (args: any) => Promise<any>;
};

type PrismaLike = {
  order: PrismaOrderDelegate;
};

export function createPrismaOrderRepository(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prisma: PrismaLike
): OrderRepository {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    save: async (items: OrderItem[]): Promise<Order> => {
      throw new Error("not implemented");
    },
  };
}
