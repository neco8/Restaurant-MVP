"use client";

import Link from "next/link";
import type { Product } from "@/lib";
import { formatPrice, ROUTES } from "@/lib";

export default function MenuList({ products }: { products: Product[] }) {
  return (
    <>
      <h1>Menu</h1>
      {products.map((product) => (
        <Link key={product.id} href={ROUTES.MENU_ITEM(product.id)} data-testid="product-card">
          <span data-testid="product-name">{product.name}</span>
          <span data-testid="product-price">{formatPrice(product.price)}</span>
        </Link>
      ))}
    </>
  );
}
