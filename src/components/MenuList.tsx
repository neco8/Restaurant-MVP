"use client";

import Link from "next/link";
import type { Product } from "@/lib";
import { formatPrice, ROUTES } from "@/lib";

export default function MenuList({ products }: { products: Product[] }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-10">Menu</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={ROUTES.MENU_ITEM(product.id)}
            data-testid="product-card"
            className="group block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-200 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-500/50"
          >
            <span data-testid="product-name" className="block text-lg font-bold mb-2 group-hover:text-amber-700 transition-colors dark:group-hover:text-amber-400">
              {product.name}
            </span>
            <span data-testid="product-price" className="text-amber-700 font-semibold dark:text-amber-400">
              {formatPrice(product.price)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
