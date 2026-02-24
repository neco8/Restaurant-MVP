export type OrderLine = {
  price: number;
  quantity: number;
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
  quantity: number;
};

export type ProductRepository = {
  findAll: () => Promise<Product[]>;
};
