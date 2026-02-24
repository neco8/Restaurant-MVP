declare const __brand: unique symbol;
export type Price = number & { readonly [__brand]: "Price" };

export function parsePrice(value: unknown): Price | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return value as Price;
}

export function price(value: number): Price {
  const p = parsePrice(value);
  if (p === null) {
    throw new Error(`Invalid price: ${value}`);
  }
  return p;
}
