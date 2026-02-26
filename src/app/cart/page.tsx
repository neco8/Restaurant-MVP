"use client";

import { useEffect, useState } from "react";
import type { CartItem, Product } from "@/lib";
import { getStoredCartItems, hydrateCart, decreaseCartItem, decreaseQuantity } from "@/lib";
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
      prev.reduce<CartItem[]>((acc, item) => {
        if (item.id !== id) return [...acc, item];
        const decreased = decreaseQuantity(item.quantity);
        return decreased.isOk() ? [...acc, { ...item, quantity: decreased.value }] : acc;
      }, []),
    );
  }

  return <CartView cartItems={cartItems} onDecreaseItem={handleDecreaseItem} />;
}
