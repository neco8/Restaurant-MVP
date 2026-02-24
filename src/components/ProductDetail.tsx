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
  const [cartCount, setCartCount] = useState(0);

  function handleAddToCart() {
    addToCart(product.id);
    setCartCount(cartCount + 1);
    onAddToCart?.();
  }

  return (
    <>
      <h1>{product.name}</h1>
      <span data-testid="product-price">{formatPrice(product.price)}</span>
      <span data-testid="product-description">{product.description}</span>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <span data-testid="cart-count">{cartCount}</span>
      <a href={ROUTES.CART}>View Cart</a>
    </>
  );
}
