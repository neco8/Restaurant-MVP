import type { Price } from "./price";

export function formatPrice(p: Price): string {
  return `$${p.toFixed(2)}`;
}
