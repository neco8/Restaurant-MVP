import type { OrderLine } from "@/lib/types";
import type { Price } from "./price";
import { price } from "./price";

function lineTotalCents(item: OrderLine): number {
  return Math.round(item.price * 100) * item.quantity;
}

export function lineTotal(item: OrderLine): Price {
  return price(lineTotalCents(item) / 100);
}

export function orderTotal(items: OrderLine[]): Price {
  return price(items.reduce((sum, item) => sum + lineTotalCents(item), 0) / 100);
}
