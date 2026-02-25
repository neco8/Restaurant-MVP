"use client";

import { useState } from "react";
import type { Product } from "@/lib";
import { formatPrice, ROUTES, addToCart } from "@/lib";

export default function ProductDetail({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: () => void;
}) {
  const [addedCount, setAddedCount] = useState(0);

  function handleAddToCart() {
    addToCart(product.id);
    setAddedCount((prev) => prev + 1);
    onAddToCart?.();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-3">{product.name}</h1>
      <span data-testid="product-price" className="block text-2xl font-bold text-amber-700 mb-4 dark:text-amber-400">
        {formatPrice(product.price)}
      </span>
      <span data-testid="product-description" className="block text-stone-500 leading-relaxed mb-10 dark:text-stone-400">
        {product.description}
      </span>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleAddToCart}
          className="rounded-full bg-amber-600 text-white px-8 py-3 font-semibold shadow-lg shadow-amber-600/20 hover:bg-amber-700 hover:shadow-amber-700/25 active:scale-[0.98] transition-all dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400 dark:shadow-amber-500/20"
        >
          Add to Cart
        </button>
        <span data-testid="added-count" className="text-sm text-stone-400 tabular-nums">
          {addedCount}
        </span>
      </div>
      <a
        href={ROUTES.CART}
        className="text-amber-700 font-medium underline underline-offset-4 decoration-amber-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors dark:text-amber-400 dark:decoration-amber-600 dark:hover:decoration-amber-400 dark:hover:text-amber-300"
      >
        View Cart
      </a>
    </div>
  );
}
