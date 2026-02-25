"use client";

import Link from "next/link";
import type { Product } from "@/lib";
import { formatPrice, ROUTES } from "@/lib";

export default function MenuList({ products }: { products: Product[] }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Menu</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={ROUTES.MENU_ITEM(product.id)}
            data-testid="product-card"
            className="block rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-stone-300 transition-all dark:border-stone-700 dark:hover:border-stone-600"
          >
            <span data-testid="product-name" className="block text-lg font-semibold mb-2">
              {product.name}
            </span>
            <span data-testid="product-price" className="text-stone-600 font-medium dark:text-stone-400">
              {formatPrice(product.price)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
