type Item = { price: number; quantity: number };

function lineTotalCents(item: Item): number {
  return Math.round(item.price * 100) * item.quantity;
}

export function lineTotal(item: Item): number {
  return lineTotalCents(item) / 100;
}

export function total(items: Item[]): number {
  return items.reduce((sum, item) => sum + lineTotalCents(item), 0) / 100;
}
