import type { StoredCartItem, CartItem, Product } from "./types";
import { quantity, parseQuantity } from "./quantity";

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
      parseQuantity((item as Record<string, unknown>).quantity) !== null,
  ) as StoredCartItem[];
}

export function addToCart(id: string): void {
  const storedItems = getStoredCartItems();
  const existing = storedItems.find((item) => item.id === id);
  if (existing) {
    existing.quantity = quantity(existing.quantity + 1);
  } else {
    storedItems.push({ id, quantity: quantity(1) });
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function decreaseCartItem(id: string): void {
  // TODO: implement
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}
