import { parseQuantity, quantity, decreaseQuantity } from "./quantity";
import { ok } from "neverthrow";

test("parseQuantity returns ok with value for positive integer", () => {
  expect(parseQuantity(1)).toEqual(ok(1));
});

test("parseQuantity returns ok with value for large positive integer", () => {
  expect(parseQuantity(99)).toEqual(ok(99));
});

test("parseQuantity returns err for zero", () => {
  expect(parseQuantity(0).isErr()).toBe(true);
});

test("parseQuantity returns err for negative integer", () => {
  expect(parseQuantity(-1).isErr()).toBe(true);
});

test("parseQuantity returns err for fraction", () => {
  expect(parseQuantity(0.5).isErr()).toBe(true);
});

test("parseQuantity returns err for NaN", () => {
  expect(parseQuantity(NaN).isErr()).toBe(true);
});

test("parseQuantity returns err for non-number", () => {
  expect(parseQuantity("1").isErr()).toBe(true);
});

test("quantity returns value for positive integer", () => {
  expect(quantity(3)).toBe(3);
});

test("quantity throws for invalid value", () => {
  expect(() => quantity(0)).toThrow();
});

test("decreaseQuantity returns ok with decreased quantity for quantity greater than one", () => {
  expect(decreaseQuantity(quantity(2))).toEqual(ok(1));
});

test("decreaseQuantity returns err for quantity one", () => {
  expect(decreaseQuantity(quantity(1)).isErr()).toBe(true);
});
