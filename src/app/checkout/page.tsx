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

    fetch("/api/products")
      .then((res) => res.json() as Promise<Product[]>)
      .then((products) => {
        setCartItems(hydrateCart(storedItems, products));
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems: storedItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json() as Promise<{ clientSecret: string; paymentIntentId: string }>;
      })
      .then((payment) => {
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
