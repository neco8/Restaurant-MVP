import type { OrderLine } from "@/lib/types";

function lineTotalCents(item: OrderLine): number {
  return Math.round(item.price * 100) * item.quantity;
}

export function lineTotal(item: OrderLine): number {
  return lineTotalCents(item) / 100;
}

export function total(items: OrderLine[]): number {
  return items.reduce((sum, item) => sum + lineTotalCents(item), 0) / 100;
}
