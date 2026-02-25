"use client";

import { useEffect, useState } from "react";
import type { CartItem, Product } from "@/lib";
import { getStoredCartItems, hydrateCart } from "@/lib";
import { CartView } from "./CartView";

export default function CartRoute() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedItems = getStoredCartItems();
    if (storedItems.length === 0) return;
    fetch("/api/products")
      .then((r) => r.json())
      .then((products: Product[]) => {
        setCartItems(hydrateCart(storedItems, products));
      });
  }, []);

  return <CartView cartItems={cartItems} />;
}
