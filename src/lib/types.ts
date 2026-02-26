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

export type ProductRepository = {
  findAll: () => Promise<Product[]>;
};

export type EmailSender = {
  send: (options: { to: string; subject: string; body: string }) => Promise<void>;
};
