declare const __brand: unique symbol;
export type Quantity = number & { readonly [__brand]: "Quantity" };

export function parseQuantity(value: unknown): Quantity | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    return null;
  }
  return value as Quantity;
}

export function quantity(value: number): Quantity {
  const q = parseQuantity(value);
  if (q === null) {
    throw new Error(`Invalid quantity: ${value}`);
  }
  return q;
}

export function decreaseQuantity(q: Quantity): Quantity | null {
  return parseQuantity(q - 1);
}
