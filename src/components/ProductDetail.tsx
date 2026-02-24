"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function ProductDetail({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: () => void;
}) {
  const [cartCount, setCartCount] = useState(0);

  function handleAddToCart() {
    setCartCount(cartCount + 1);
    onAddToCart?.();
  }

  return (
    <>
      <h1>{product.name}</h1>
      <span data-testid="product-price">{product.price}</span>
      <span data-testid="product-description">{product.description}</span>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <span data-testid="cart-count">{cartCount}</span>
    </>
  );
}
