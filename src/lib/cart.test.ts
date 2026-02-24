import { addToCart, getCartEntries, clearCart } from "./cart";
import { quantity } from "./quantity";

beforeEach(() => {
  localStorage.clear();
});

test("getCartEntries returns empty array when cart is empty", () => {
  expect(getCartEntries()).toEqual([]);
});

test("addToCart stores item id and quantity in localStorage", () => {
  addToCart("1");
  expect(getCartEntries()).toEqual([{ id: "1", quantity: quantity(1) }]);
});

test("addToCart increments quantity for existing item", () => {
  addToCart("1");
  addToCart("1");
  expect(getCartEntries()).toEqual([{ id: "1", quantity: quantity(2) }]);
});

test("addToCart keeps separate entries for different items", () => {
  addToCart("1");
  addToCart("2");
  expect(getCartEntries()).toHaveLength(2);
});

test("clearCart removes all items", () => {
  addToCart("1");
  clearCart();
  expect(getCartEntries()).toEqual([]);
});
