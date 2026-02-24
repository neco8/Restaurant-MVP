"use client";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function MenuList({ products }: { products: Product[] }) {
  return <h1>メニュー</h1>;
}
