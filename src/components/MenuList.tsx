"use client";

import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function MenuList({ products }: { products: Product[] }) {
  return (
    <>
      <h1>Menu</h1>
      {products.map((product) => (
        <Link key={product.id} href={`/menu/${product.id}`} data-testid="product-card">
          <span data-testid="product-name">{product.name}</span>
        </Link>
      ))}
    </>
  );
}
