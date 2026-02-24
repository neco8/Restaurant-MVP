import type { CartEntry } from "./types";
import { quantity, parseQuantity } from "./quantity";

const CART_KEY = "cart";

export function getCartEntries(): CartEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  const parsed: unknown[] = JSON.parse(raw);
  return parsed.filter(
    (item): item is CartEntry =>
      item !== null &&
      typeof item === "object" &&
      "id" in item &&
      typeof (item as Record<string, unknown>).id === "string" &&
      "quantity" in item &&
      parseQuantity((item as Record<string, unknown>).quantity) !== null,
  ) as CartEntry[];
}

export function addToCart(id: string): void {
  const entries = getCartEntries();
  const existing = entries.find((e) => e.id === id);
  if (existing) {
    existing.quantity = quantity(existing.quantity + 1);
  } else {
    entries.push({ id, quantity: quantity(1) });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(entries));
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}
