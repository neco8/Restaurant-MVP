import type { OrderLine } from "@/lib/types";
import type { Price } from "./price";
import { price } from "./price";
import { CENTS_PER_DOLLAR } from "./currency";

function lineTotalCents(item: OrderLine): number {
  return Math.round(item.price * CENTS_PER_DOLLAR) * item.quantity;
}

export function lineTotal(item: OrderLine): Price {
  return price(lineTotalCents(item) / CENTS_PER_DOLLAR);
}

export function orderTotal(items: OrderLine[]): Price {
  return price(items.reduce((sum, item) => sum + lineTotalCents(item), 0) / CENTS_PER_DOLLAR);
}
