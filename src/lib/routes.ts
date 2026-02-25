export const ROUTES = {
  HOME: "/",
  MENU: "/menu",
  MENU_ITEM: (id: string) => `/menu/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_COMPLETE: (id: string) => `/orders/${id}/complete`,
};
