"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib";
import { getCartItems } from "@/lib";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { CheckoutPage } from "./CheckoutPage";

export default function CheckoutRoute() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) return;
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Server error");
        return r.json();
      })
      .then((data: { clientSecret: string }) => {
        setClientSecret(data.clientSecret);
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });
  }, [cartItems]);

  return (
    <CheckoutPage cartItems={cartItems}>
      {error && <p role="alert">{error}</p>}
      {clientSecret ? (
        <StripePaymentForm clientSecret={clientSecret} />
      ) : (
        <button disabled={cartItems.length === 0}>Place Order</button>
      )}
    </CheckoutPage>
  );
}
