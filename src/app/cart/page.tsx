"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib";
import { getCartItems } from "@/lib";
import { CartPage } from "./CartPage";

export default function CartRoute() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  return <CartPage cartItems={cartItems} />;
}
