import type { OrderItem, Order, OrderRepository } from "./types";

export async function createOrder(items: OrderItem[], repository: OrderRepository): Promise<Order> {
  return repository.save(items);
}
