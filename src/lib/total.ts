type Item = { price: number };

export function total(items: Item[]): number {
  const cents = items.reduce((sum, item) => sum + Math.round(item.price * 100), 0);
  return cents / 100;
}
