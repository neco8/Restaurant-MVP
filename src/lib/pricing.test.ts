import { orderTotal, lineTotal } from "./pricing";
import { quantity } from "./quantity";
import { price } from "./price";

test("sums prices of multiple items", () => {
  expect(orderTotal([{ price: price(9.99), quantity: quantity(1) }, { price: price(3.49), quantity: quantity(1) }])).toBe(13.48);
});

test("returns 0 for empty list", () => {
  expect(orderTotal([])).toBe(0);
});

test("handles prices that cause floating point accumulation errors", () => {
  expect(orderTotal([{ price: price(0.10), quantity: quantity(1) }, { price: price(0.20), quantity: quantity(1) }, { price: price(0.30), quantity: quantity(1) }])).toBe(0.60);
});

test("multiplies price by quantity", () => {
  expect(orderTotal([{ price: price(9.99), quantity: quantity(3) }])).toBe(29.97);
});

test("lineTotal returns price times quantity", () => {
  expect(lineTotal({ price: price(9.99), quantity: quantity(2) })).toBe(19.98);
});

test("lineTotal handles float precision", () => {
  expect(lineTotal({ price: price(0.10), quantity: quantity(3) })).toBe(0.30);
});
