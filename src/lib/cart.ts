import type { StoredCartItem, CartItem, Product } from "./types";
import { quantity, parseQuantity, decreaseQuantity } from "./quantity";

const CART_KEY = "cart";

export function getStoredCartItems(): StoredCartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  const parsed: unknown[] = JSON.parse(raw);
  return parsed.filter(
    (item): item is StoredCartItem =>
      item !== null &&
      typeof item === "object" &&
      "id" in item &&
      typeof (item as Record<string, unknown>).id === "string" &&
      "quantity" in item &&
      parseQuantity((item as Record<string, unknown>).quantity).isOk(),
  ) as StoredCartItem[];
}

export function addToCart(id: string): void {
  const storedItems = getStoredCartItems();
  const existing = storedItems.find((item) => item.id === id);
  if (existing) {
    const increased = quantity(existing.quantity + 1);
    if (increased.isErr()) return;
    existing.quantity = increased.value;
  } else {
    const initial = quantity(1);
    if (initial.isErr()) return;
    storedItems.push({ id, quantity: initial.value });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(storedItems));
}

export function hydrateCart(storedItems: StoredCartItem[], products: Product[]): CartItem[] {
  const result: CartItem[] = [];
  for (const storedItem of storedItems) {
    const product = products.find((candidate) => candidate.id === storedItem.id);
    if (product) {
      result.push({ id: storedItem.id, name: product.name, price: product.price, quantity: storedItem.quantity });
    }
  }
  return result;
}

export function decreaseCartItem(id: string): void {
  const storedItems = getStoredCartItems();
  const existing = storedItems.find((item) => item.id === id);
  if (!existing) return;
  const decreased = decreaseQuantity(existing.quantity);
  if (decreased.isErr()) {
    const filtered = storedItems.filter((item) => item.id !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(filtered));
  } else {
    existing.quantity = decreased.value;
    localStorage.setItem(CART_KEY, JSON.stringify(storedItems));
  }
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}
