import { parsePrice, price } from "./price";

test("parsePrice returns value for positive number", () => {
  expect(parsePrice(12.00)).toBe(12);
});

test("parsePrice returns value for decimal price", () => {
  expect(parsePrice(9.99)).toBe(9.99);
});

test("parsePrice returns value for zero", () => {
  expect(parsePrice(0)).toBe(0);
});

test("parsePrice returns null for negative number", () => {
  expect(parsePrice(-1)).toBeNull();
});

test("parsePrice returns null for NaN", () => {
  expect(parsePrice(NaN)).toBeNull();
});

test("parsePrice returns null for Infinity", () => {
  expect(parsePrice(Infinity)).toBeNull();
});

test("parsePrice returns null for non-number", () => {
  expect(parsePrice("12.00")).toBeNull();
});

test("price returns value for valid price", () => {
  expect(price(9.99)).toBe(9.99);
});

test("price throws for negative value", () => {
  expect(() => price(-1)).toThrow();
});
