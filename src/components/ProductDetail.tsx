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
    <>
      <h1>{product.name}</h1>
      <span data-testid="product-price">{formatPrice(product.price)}</span>
      <span data-testid="product-description">{product.description}</span>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <span data-testid="added-count">{addedCount}</span>
      <a href={ROUTES.CART}>View Cart</a>
    </>
  );
}
