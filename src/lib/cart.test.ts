import { addToCart, getCartItems, clearCart } from "./cart";
import { quantity } from "./quantity";
import { price } from "./price";

beforeEach(() => {
  localStorage.clear();
});

test("getCartItems returns empty array when cart is empty", () => {
  expect(getCartItems()).toEqual([]);
});

test("addToCart stores item in localStorage", () => {
  addToCart({ id: "1", name: "Ramen", price: price(12.00) });
  expect(getCartItems()).toEqual([{ id: "1", name: "Ramen", price: price(12.00), quantity: quantity(1) }]);
});

test("addToCart increments quantity for existing item", () => {
  addToCart({ id: "1", name: "Ramen", price: price(12.00) });
  addToCart({ id: "1", name: "Ramen", price: price(12.00) });
  expect(getCartItems()).toEqual([{ id: "1", name: "Ramen", price: price(12.00), quantity: quantity(2) }]);
});

test("addToCart keeps separate entries for different items", () => {
  addToCart({ id: "1", name: "Ramen", price: price(12.00) });
  addToCart({ id: "2", name: "Gyoza", price: price(7.50) });
  expect(getCartItems()).toHaveLength(2);
});

test("clearCart removes all items", () => {
  addToCart({ id: "1", name: "Ramen", price: price(12.00) });
  clearCart();
  expect(getCartItems()).toEqual([]);
});
