"use client";

import { useEffect, useState } from "react";
import type { CartItem, Product } from "@/lib";
import { ROUTES, getStoredCartItems, hydrateCart, formatPrice, lineTotal, orderTotal } from "@/lib";

// Named export for unit tests (accepts cartItems prop directly)
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

// Default export: real app reads cart from localStorage, hydrates from server
export default function CartRoute() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedItems = getStoredCartItems();
    if (storedItems.length === 0) return;
    fetch("/api/products")
      .then((r) => r.json())
      .then((products: Product[]) => {
        setCartItems(hydrateCart(storedItems, products));
      });
  }, []);

  return <CartPage cartItems={cartItems} />;
}
