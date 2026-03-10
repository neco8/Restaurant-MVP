import type { Price } from "./price";
import type { Quantity } from "./quantity";

export interface OrderItem {
  productId: string;
  quantity: Quantity;
  price: Price;
}

export interface Order {
  id: string;
  status: string;
  total: Price;
  items: OrderItem[];
}

export interface OrderRepository {
  save: (items: OrderItem[]) => Promise<Order>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createOrder(items: OrderItem[], repository: OrderRepository): Promise<Order> {
  return repository.save(items);
}
