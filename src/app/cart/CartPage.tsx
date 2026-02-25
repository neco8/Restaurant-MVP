"use client";

import type { CartItem } from "@/lib";
import { ROUTES, formatPrice, lineTotal, orderTotal } from "@/lib";

export function CartPage({ cartItems = [] }: { cartItems?: CartItem[] } = {}) {
  return (
    <>
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id}>
              <span>{item.name}</span>
              {item.quantity > 1 && <span>×{item.quantity}</span>}
              <span>{formatPrice(lineTotal(item))}</span>
            </div>
          ))}
          <p>Total: {formatPrice(orderTotal(cartItems))}</p>
        </>
      )}
      <a href={ROUTES.CHECKOUT}>Proceed to Checkout</a>
    </>
  );
}
