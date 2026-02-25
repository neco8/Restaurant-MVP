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
    setAddedCount(addedCount + 1);
    onAddToCart?.();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <span data-testid="product-price" className="block text-2xl font-semibold text-stone-700 mb-4 dark:text-stone-300">
        {formatPrice(product.price)}
      </span>
      <span data-testid="product-description" className="block text-stone-600 mb-8 dark:text-stone-400">
        {product.description}
      </span>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleAddToCart}
          className="rounded-lg bg-stone-900 text-white px-6 py-3 font-medium shadow-sm hover:bg-stone-800 transition-colors dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          Add to Cart
        </button>
        <span data-testid="added-count" className="text-sm text-stone-500">
          {addedCount}
        </span>
      </div>
      <a
        href={ROUTES.CART}
        className="text-stone-600 underline underline-offset-4 hover:text-stone-900 transition-colors dark:text-stone-400 dark:hover:text-stone-100"
      >
        View Cart
      </a>
    </div>
  );
}
