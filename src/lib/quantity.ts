import { ok, err, type Result } from "neverthrow";

declare const __brand: unique symbol;
export type Quantity = number & { readonly [__brand]: "Quantity" };

export function parseQuantity(value: unknown): Result<Quantity, string> {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    return err(`Invalid quantity: ${String(value)}`);
  }
  return ok(value as Quantity);
}

export function quantity(value: number): Result<Quantity, string> {
  return parseQuantity(value);
}

export function decreaseQuantity(q: Quantity): Result<Quantity, string> {
  return parseQuantity(q - 1);
}
