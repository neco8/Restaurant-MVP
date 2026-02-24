"use client";

import { useEffect, useState } from "react";
import type { CartItem, Product } from "@/lib";
import { orderTotal, lineTotal, formatPrice, getStoredCartItems, hydrateCart } from "@/lib";
import { StripePaymentForm } from "@/components/StripePaymentForm";

// Named export: pure presentational view (no side effects, testable in isolation)
export function CheckoutView({
  cartItems = [],
  loading = false,
  children,
}: {
  cartItems?: CartItem[];
  loading?: boolean;
  children?: React.ReactNode;
} = {}) {
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
      {children ?? (loading ? (
        <p role="status">Preparing payment…</p>
      ) : (
        <button disabled={cartItems.length === 0}>Place Order</button>
      ))}
    </div>
  );
}

// Default export: real app reads cart from localStorage and integrates Stripe
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
