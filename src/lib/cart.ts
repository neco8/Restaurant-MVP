import type { CartItem } from "./types";
import { quantity, parseQuantity } from "./quantity";

const CART_KEY = "cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  const parsed: unknown[] = JSON.parse(raw);
  return parsed.filter(
    (item): item is CartItem =>
      item !== null &&
      typeof item === "object" &&
      "quantity" in item &&
      parseQuantity((item as Record<string, unknown>).quantity) !== null,
  ) as CartItem[];
}

export function addToCart(item: { id: string; name: string; price: number }): void {
  const items = getCartItems();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity = quantity(existing.quantity + 1);
  } else {
    items.push({ ...item, quantity: quantity(1) });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}
