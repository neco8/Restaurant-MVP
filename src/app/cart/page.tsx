"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib";
import { ROUTES, getCartItems } from "@/lib";

// Named export for unit tests (accepts cartItems prop directly)
export function CartPage({ cartItems = [] }: { cartItems?: CartItem[] } = {}) {
  return (
    <>
      <h1>Cart</h1>
      {cartItems.map((item) => (
        <span key={item.id}>{item.name}</span>
      ))}
      <a href={ROUTES.CHECKOUT}>Proceed to Checkout</a>
    </>
  );
}

// Default export: real app reads cart from localStorage
export default function CartRoute() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  return <CartPage cartItems={cartItems} />;
}
