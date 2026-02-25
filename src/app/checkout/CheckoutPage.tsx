"use client";

import type { CartItem } from "@/lib";
import { orderTotal, lineTotal, formatPrice } from "@/lib";

export function CheckoutPage({
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
