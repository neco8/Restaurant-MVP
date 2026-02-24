import type { Quantity } from "./quantity";

export type OrderLine = {
  price: number;
  quantity: Quantity;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: Quantity;
};

export type ProductRepository = {
  findAll: () => Promise<Product[]>;
};
