type Item = { price: number; quantity?: number };

export function total(items: Item[]): number {
  const cents = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * (item.quantity ?? 1),
    0
  );
  return cents / 100;
}
