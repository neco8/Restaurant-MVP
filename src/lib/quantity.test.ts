import { parseQuantity, quantity, decreaseQuantity } from "./quantity";

test("parseQuantity returns value for positive integer", () => {
  expect(parseQuantity(1)).toBe(1);
});

test("parseQuantity returns value for large positive integer", () => {
  expect(parseQuantity(99)).toBe(99);
});

test("parseQuantity returns null for zero", () => {
  expect(parseQuantity(0)).toBeNull();
});

test("parseQuantity returns null for negative integer", () => {
  expect(parseQuantity(-1)).toBeNull();
});

test("parseQuantity returns null for fraction", () => {
  expect(parseQuantity(0.5)).toBeNull();
});

test("parseQuantity returns null for NaN", () => {
  expect(parseQuantity(NaN)).toBeNull();
});

test("parseQuantity returns null for non-number", () => {
  expect(parseQuantity("1")).toBeNull();
});

test("quantity returns value for positive integer", () => {
  expect(quantity(3)).toBe(3);
});

test("quantity throws for invalid value", () => {
  expect(() => quantity(0)).toThrow();
});

test("decreaseQuantity returns decreased quantity for quantity greater than one", () => {
  expect(decreaseQuantity(quantity(2))).toBe(1);
});

test("decreaseQuantity returns null for quantity one", () => {
  expect(decreaseQuantity(quantity(1))).toBeNull();
});
