import type { OrderRepository, Order, OrderItem, DetailedOrder, DetailedOrderItem } from "./types";
import { orderTotal } from "./totals";

type StoredOrder = Order & { createdAt: Date };

export function createInMemoryOrderRepository(
  productNames?: Map<string, string>
): OrderRepository {
  const orders: StoredOrder[] = [];

  return {
    async save(items: OrderItem[]): Promise<Order> {
      const order: StoredOrder = {
        id: crypto.randomUUID(),
        status: "pending",
        total: orderTotal(items),
        items,
        createdAt: new Date(),
      };
      orders.push(order);
      return { id: order.id, status: order.status, total: order.total, items: order.items };
    },

    async count(): Promise<number> {
      return orders.length;
    },

    async findById(id: string) {
      const order = orders.find((o) => o.id === id);
      if (!order) return null;
      return { id: order.id, status: order.status };
    },

    async updateStatus(id: string, status: string) {
      const order = orders.find((o) => o.id === id)!;
      order.status = status;
      return { id: order.id, status: order.status };
    },

    async deleteAll(): Promise<void> {
      orders.length = 0;
    },

    async findAll(options?: { limit?: number }): Promise<DetailedOrder[]> {
      const sorted = [...orders].reverse();
      const limited = options?.limit ? sorted.slice(0, options.limit) : sorted;
      return limited.map((order) => ({
        id: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.map((item): DetailedOrderItem => ({
          id: item.productId,
          productName: productNames?.get(item.productId) ?? "Unknown",
          quantity: item.quantity,
          price: item.price,
        })),
      }));
    },
  };
}
