"use client";

import Link from "next/link";
import type { Product } from "@/lib";
import { formatPrice, ROUTES } from "@/lib";

export default function MenuList({ products }: { products: Product[] }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
      <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
        Our Selection
      </p>
      <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[0.9] mb-16">Menu</h1>
      <div className="divide-y divide-border">
        {products.map((product) => (
          <Link
            key={product.id}
            href={ROUTES.MENU_ITEM(product.id)}
            data-testid="product-card"
            className="group flex items-baseline justify-between py-5 hover:pl-4 transition-all duration-300"
          >
            <span data-testid="product-name" className="font-serif text-xl sm:text-2xl font-normal tracking-tight group-hover:text-accent transition-colors duration-300">
              {product.name}
            </span>
            <span className="flex-1 border-b border-dotted border-border mx-4 min-w-[40px] self-center translate-y-[-3px]" />
            <span data-testid="product-price" className="font-sans text-sm font-light tracking-wider text-muted">
              {formatPrice(product.price)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
