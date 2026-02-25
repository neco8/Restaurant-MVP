import { ROUTES } from "@/lib/routes";

test("ROUTES.HOME is the root path", () => {
  expect(ROUTES.HOME).toBe("/");
});

test("ROUTES.MENU is /menu", () => {
  expect(ROUTES.MENU).toBe("/menu");
});

test("ROUTES.MENU_ITEM builds a path from an id", () => {
  expect(ROUTES.MENU_ITEM("42")).toBe("/menu/42");
});

test("ROUTES.CART is /cart", () => {
  expect(ROUTES.CART).toBe("/cart");
});

test("ROUTES.CHECKOUT is /checkout", () => {
  expect(ROUTES.CHECKOUT).toBe("/checkout");
});

test("ROUTES.ORDER_COMPLETE builds an order confirmation path from an id", () => {
  expect(ROUTES.ORDER_COMPLETE("pi_123")).toBe("/orders/pi_123/complete");
});
