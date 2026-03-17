import type { Price } from "./price";
import type { Quantity } from "./quantity";

export type OrderLine = {
  price: Price;
  quantity: Quantity;
};

export type Product = {
  id: string;
  name: string;
  price: Price;
  description: string;
};

export type StoredCartItem = {
  id: string;
  quantity: Quantity;
};

export type CartItem = {
  id: string;
  name: string;
  price: Price;
  quantity: Quantity;
};

export type CartState =
  | { status: "loading"; storedItems: StoredCartItem[] }
  | { status: "loaded"; items: CartItem[] };

export type OrderItem = OrderLine & { productId: string };

export type Order = {
  id: string;
  status: string;
  total: Price;
  items: OrderItem[];
};

export type DetailedOrderItem = {
  id: string;
  productName: string;
  quantity: Quantity;
  price: Price;
};

export type DetailedOrder = {
  id: string;
  status: string;
  total: Price;
  createdAt: Date;
  items: DetailedOrderItem[];
};

export type OrderRepository = {
  save: (items: OrderItem[]) => Promise<Order>;
  count: () => Promise<number>;
  findAll: (options?: { limit?: number }) => Promise<DetailedOrder[]>;
};

export type ProductRepository = {
  findAll: () => Promise<Product[]>;
  findById: (id: string) => Promise<Product | null>;
  create: (input: { name: string; description: string; price: Price }) => Promise<Product>;
  update: (id: string, input: { name: string; description: string; price: Price }) => Promise<Product>;
  delete: (id: string) => Promise<void>;
};
