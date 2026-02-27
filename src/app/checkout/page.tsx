"use client";

import { useEffect, useState } from "react";
import type { CartState, Product } from "@/lib";
import { getStoredCartItems, hydrateCart } from "@/lib";
import { CheckoutView } from "./CheckoutView";
import { CheckoutPaymentSection } from "./CheckoutPaymentSection";

export default function CheckoutRoute() {
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
      .then((res) => res.json() as Promise<Product[]>)
      .then((products) => {
        setCartState({ status: "loaded", items: hydrateCart(storedItems, products) });
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });
  }, []);

  const cartItems = cartState.status === "loaded" ? cartState.items : [];

  return (
    <CheckoutView cartState={cartState}>
      {error && <p role="alert">{error}</p>}
      {cartItems.length > 0 ? (
        <CheckoutPaymentSection cartItems={cartItems} />
      ) : (
        <button disabled>Place Order</button>
      )}
    </CheckoutView>
  );
}
