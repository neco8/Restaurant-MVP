"use client";

import { useEffect, useState } from "react";
import type { CartItem, Product } from "@/lib";
import { getStoredCartItems, hydrateCart, decreaseCartItem, quantity } from "@/lib";
import { CartView } from "./CartView";

export default function CartRoute() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedItems = getStoredCartItems();
    if (storedItems.length === 0) return;
    fetch("/api/products")
      .then((res) => res.json())
      .then((products: Product[]) => {
        setCartItems(hydrateCart(storedItems, products));
      });
  }, []);

  function handleDecreaseItem(id: string) {
    decreaseCartItem(id);
    setCartItems((prev) =>
      prev
        .filter((item) => !(item.id === id && item.quantity <= 1))
        .map((item) =>
          item.id === id ? { ...item, quantity: quantity(item.quantity - 1) } : item,
        ),
    );
  }

  return <CartView cartItems={cartItems} onDecreaseItem={handleDecreaseItem} />;
}
