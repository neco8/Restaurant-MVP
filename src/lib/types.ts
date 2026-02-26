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

export type CreateProductInput = {
  name: string;
  description: string;
  price: Price;
};

export type UpdateProductInput = Partial<CreateProductInput>;

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
  findById: (id: string) => Promise<Product | null>;
  create: (input: CreateProductInput) => Promise<Product>;
  update: (id: string, input: UpdateProductInput) => Promise<Product>;
  delete: (id: string) => Promise<void>;
};
