import { addToCart, getStoredCartItems, clearCart, hydrateCart, decreaseCartItem } from "./cart";
import { quantity } from "./quantity";
import { price } from "./price";
import type { Product } from "./types";

beforeEach(() => {
  localStorage.clear();
});

test("getStoredCartItems returns empty array when cart is empty", () => {
  expect(getStoredCartItems()).toEqual([]);
});

test("addToCart stores item id and quantity in localStorage", () => {
  addToCart("1");
  expect(getStoredCartItems()).toEqual([{ id: "1", quantity: quantity(1) }]);
});

test("addToCart increments quantity for existing item", () => {
  addToCart("1");
  addToCart("1");
  expect(getStoredCartItems()).toEqual([{ id: "1", quantity: quantity(2) }]);
});

test("addToCart keeps separate entries for different items", () => {
  addToCart("1");
  addToCart("2");
  expect(getStoredCartItems()).toHaveLength(2);
});

test("clearCart removes all items", () => {
  addToCart("1");
  clearCart();
  expect(getStoredCartItems()).toEqual([]);
});

const products: Product[] = [
  { id: "1", name: "Ramen", price: price(12.00), description: "Tonkotsu" },
  { id: "2", name: "Gyoza", price: price(7.50), description: "Dumplings" },
];

test("hydrateCart returns empty array when storedItems are empty", () => {
  expect(hydrateCart([], products)).toEqual([]);
});

test("hydrateCart combines storedItem quantity with product name and price", () => {
  expect(hydrateCart([{ id: "1", quantity: quantity(2) }], products)).toEqual([
    { id: "1", name: "Ramen", price: price(12.00), quantity: quantity(2) },
  ]);
});

test("hydrateCart drops storedItems whose id is not found in products", () => {
  expect(hydrateCart([{ id: "999", quantity: quantity(1) }], products)).toEqual([]);
});

test("decreaseCartItem decrements quantity for existing item", () => {
  addToCart("1");
  addToCart("1");
  decreaseCartItem("1");
  expect(getStoredCartItems()).toEqual([{ id: "1", quantity: quantity(1) }]);
});

test("decreaseCartItem removes item when quantity reaches zero", () => {
  addToCart("1");
  decreaseCartItem("1");
  expect(getStoredCartItems()).toEqual([]);
});

test("decreaseCartItem does nothing for nonexistent item", () => {
  addToCart("1");
  decreaseCartItem("999");
  expect(getStoredCartItems()).toEqual([{ id: "1", quantity: quantity(1) }]);
});
