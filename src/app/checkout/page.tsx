"use client";

import { useEffect, useState } from "react";
import type { CartItem, Product } from "@/lib";
import { getStoredCartItems, hydrateCart } from "@/lib";
import { CheckoutView } from "./CheckoutView";
import { CheckoutPaymentSection } from "./CheckoutPaymentSection";

export default function CheckoutRoute() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedItems = getStoredCartItems();
    if (storedItems.length === 0) return;

    fetch("/api/products")
      .then((res) => res.json() as Promise<Product[]>)
      .then((products) => {
        setCartItems(hydrateCart(storedItems, products));
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });
  }, []);

  return (
    <CheckoutView cartItems={cartItems}>
      {error && <p role="alert">{error}</p>}
      {cartItems.length > 0 ? (
        <CheckoutPaymentSection cartItems={cartItems} />
      ) : (
        <button disabled>Place Order</button>
      )}
    </CheckoutView>
  );
}
