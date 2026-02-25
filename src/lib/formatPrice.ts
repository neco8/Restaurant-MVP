import type { Price } from "./price";

export function formatPrice(value: Price): string {
  return `$${value.toFixed(2)}`;
}
