import { total } from "./total";

test("sums prices of multiple items", () => {
  expect(total([{ price: 9.99, quantity: 1 }, { price: 3.49, quantity: 1 }])).toBe(13.48);
});

test("returns 0 for empty list", () => {
  expect(total([])).toBe(0);
});

test("handles prices that cause floating point accumulation errors", () => {
  expect(total([{ price: 0.10, quantity: 1 }, { price: 0.20, quantity: 1 }, { price: 0.30, quantity: 1 }])).toBe(0.60);
});

test("multiplies price by quantity", () => {
  expect(total([{ price: 9.99, quantity: 3 }])).toBe(29.97);
});
