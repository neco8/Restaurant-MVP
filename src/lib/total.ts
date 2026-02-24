type Item = { price: number };

export function total(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
