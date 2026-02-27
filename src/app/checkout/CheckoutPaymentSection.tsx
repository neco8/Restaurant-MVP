"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib";
import { StripePaymentForm } from "@/components/StripePaymentForm";

export function CheckoutPaymentSection({ cartItems }: { cartItems: CartItem[] }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error || "Something went wrong. Please try again.");
          return;
        }
        const payment = await res.json() as { clientSecret: string; paymentIntentId: string };
        setClientSecret(payment.clientSecret);
        setPaymentIntentId(payment.paymentIntentId);
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });
  }, [cartItems]);

  return (
    <>
      {error && <p role="alert">{error}</p>}
      {clientSecret && paymentIntentId ? (
        <StripePaymentForm clientSecret={clientSecret} paymentIntentId={paymentIntentId} />
      ) : (
        <button>Place Order</button>
      )}
    </>
  );
}
