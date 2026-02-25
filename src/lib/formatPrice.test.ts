import { formatPrice } from "./formatPrice";
import { price } from "./price";

test("formats a price with dollar sign and two decimal places", () => {
  expect(formatPrice(price(9.99))).toBe("$9.99");
});

test("preserves trailing zero", () => {
  expect(formatPrice(price(9.90))).toBe("$9.90");
});

test("formats zero", () => {
  expect(formatPrice(price(0))).toBe("$0.00");
});
