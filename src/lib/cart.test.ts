import { getCartItems } from "./cart";

beforeEach(() => {
  localStorage.clear();
});

test("getCartItems returns empty array when cart is empty", () => {
  expect(getCartItems()).toEqual([]);
});
