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
    <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
      <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
        Detail
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight leading-[0.95] mb-4">{product.name}</h1>
      <span data-testid="product-price" className="block font-serif text-2xl font-light italic text-accent mb-6">
        {formatPrice(product.price)}
      </span>
      <span data-testid="product-description" className="block font-serif text-base font-light leading-relaxed text-muted mb-12 border-l border-border pl-6">
        {product.description}
      </span>
      <div className="flex items-center gap-5 mb-8">
        <button
          onClick={handleAddToCart}
          className="font-sans text-xs font-medium tracking-widest-2 uppercase bg-foreground text-background px-10 py-4 hover:bg-accent transition-colors duration-300 active:scale-[0.98]"
        >
          Add to Cart
        </button>
        <span data-testid="added-count" className="font-sans text-sm text-muted tabular-nums">
          {addedCount}
        </span>
      </div>
      <a
        href={ROUTES.CART}
        className="font-serif text-base italic text-accent relative inline-block after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-px after:bg-accent after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300"
      >
        View Cart
      </a>
    </div>
  );
}
