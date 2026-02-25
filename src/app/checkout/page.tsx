"use client";

import { useEffect, useState } from "react";
import type { CartItem, Product } from "@/lib";
import { getStoredCartItems, hydrateCart } from "@/lib";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { CheckoutView } from "./CheckoutView";

export default function CheckoutRoute() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedItems = getStoredCartItems();
    if (storedItems.length === 0) return;

    Promise.all([
      fetch("/api/products").then((r) => r.json()) as Promise<Product[]>,
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: storedItems.map((e) => ({ id: e.id, quantity: e.quantity })),
        }),
      }).then((r) => {
        if (!r.ok) throw new Error("Server error");
        return r.json() as Promise<{ clientSecret: string; paymentIntentId: string }>;
      }),
    ])
      .then(([products, payment]) => {
        setCartItems(hydrateCart(storedItems, products));
        setClientSecret(payment.clientSecret);
        setPaymentIntentId(payment.paymentIntentId);
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });
  }, []);

  return (
    <CheckoutView cartItems={cartItems}>
      {error && <p role="alert">{error}</p>}
      {clientSecret && paymentIntentId ? (
        <StripePaymentForm clientSecret={clientSecret} paymentIntentId={paymentIntentId} />
      ) : (
        <button disabled={cartItems.length === 0}>Place Order</button>
      )}
    </CheckoutView>
  );
}
