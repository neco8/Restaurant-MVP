import { orderTotal, lineTotal } from "./totals";
import { quantity } from "./quantity";
import { price } from "./price";

test("sums prices of multiple items", () => {
  expect(orderTotal([{ price: price(9.99), quantity: quantity(1)._unsafeUnwrap() }, { price: price(3.49), quantity: quantity(1)._unsafeUnwrap() }])).toBe(13.48);
});

test("returns 0 for empty list", () => {
  expect(orderTotal([])).toBe(0);
});

test("handles prices that cause floating point accumulation errors", () => {
  expect(orderTotal([{ price: price(0.10), quantity: quantity(1)._unsafeUnwrap() }, { price: price(0.20), quantity: quantity(1)._unsafeUnwrap() }, { price: price(0.30), quantity: quantity(1)._unsafeUnwrap() }])).toBe(0.60);
});

test("multiplies price by quantity", () => {
  expect(orderTotal([{ price: price(9.99), quantity: quantity(3)._unsafeUnwrap() }])).toBe(29.97);
});

test("lineTotal returns price times quantity", () => {
  expect(lineTotal({ price: price(9.99), quantity: quantity(2)._unsafeUnwrap() })).toBe(19.98);
});

test("lineTotal handles float precision", () => {
  expect(lineTotal({ price: price(0.10), quantity: quantity(3)._unsafeUnwrap() })).toBe(0.30);
});
