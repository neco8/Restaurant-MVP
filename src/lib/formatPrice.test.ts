import { formatPrice } from "./formatPrice";

test("formats a price with dollar sign and two decimal places", () => {
  expect(formatPrice(9.99)).toBe("$9.99");
});

test("preserves trailing zero", () => {
  expect(formatPrice(9.90)).toBe("$9.90");
});

test("formats zero", () => {
  expect(formatPrice(0)).toBe("$0.00");
});
