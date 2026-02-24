"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib";
import { orderTotal, lineTotal, formatPrice, getCartItems } from "@/lib";
import { StripePaymentForm } from "@/components/StripePaymentForm";

// Named export for unit tests (pure rendering, no Stripe/localStorage)
export function CheckoutPage({ cartItems = [], loading = false }: { cartItems?: CartItem[]; loading?: boolean } = {}) {
  return (
    <div>
      <h1>Checkout</h1>
      <section>
        <h2>Order Summary</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  {item.quantity > 1 && <span>×{item.quantity}</span>}
                  <span>{formatPrice(lineTotal(item))}</span>
                </li>
              ))}
            </ul>
            <p data-testid="checkout-total">Total: {formatPrice(orderTotal(cartItems))}</p>
          </>
        )}
      </section>
      {loading ? (
        <p role="status">Preparing payment…</p>
      ) : (
        <button disabled={cartItems.length === 0}>Place Order</button>
      )}
    </div>
  );
}

// Default export: real app reads cart from localStorage and integrates Stripe
export default function CheckoutRoute() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) return;
    const amountInCents = Math.round(orderTotal(cartItems) * 100);
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountInCents }),
    })
      .then((r) => r.json())
      .then((data: { clientSecret: string }) => {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.clientSecret.split("_secret_")[0]);
      });
  }, [cartItems]);

  const amountInCents = Math.round(orderTotal(cartItems) * 100);

  return (
    <div>
      {clientSecret && paymentIntentId ? (
        <StripePaymentForm
          clientSecret={clientSecret}
          paymentIntentId={paymentIntentId}
          amountInCents={amountInCents}
        />
      ) : (
        <button disabled={cartItems.length === 0}>Place Order</button>
      )}
    </div>
  );
}
