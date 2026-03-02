"use client";

import { useEffect, useState } from "react";
import type { CartState, Product } from "@/lib";
import { getStoredCartItems, hydrateCart, decreaseCartItem, decreaseQuantity } from "@/lib";
import { CartView } from "./CartView";

export default function CartRoute() {
  const [cartState, setCartState] = useState<CartState>({ status: "loading", storedItems: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedItems = getStoredCartItems();
    if (storedItems.length === 0) {
      setCartState({ status: "loaded", items: [] });
      return;
    }
    setCartState({ status: "loading", storedItems });
    fetch("/api/products")
      .then((res) => res.json())
      .then((products: Product[]) => {
        setCartState({ status: "loaded", items: hydrateCart(storedItems, products) });
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });
  }, []);

  function handleDecreaseItem(id: string) {
    decreaseCartItem(id);
    setCartState((prev) => {
      if (prev.status !== "loaded") return prev;
      return {
        status: "loaded",
        items: prev.items.reduce<typeof prev.items>((acc, item) => {
          if (item.id !== id) return [...acc, item];
          const decreased = decreaseQuantity(item.quantity);
          return decreased.isOk() ? [...acc, { ...item, quantity: decreased.value }] : acc;
        }, []),
      };
    });
  }

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <CartView cartState={cartState} onDecreaseItem={handleDecreaseItem} />
    </>
  );
}
