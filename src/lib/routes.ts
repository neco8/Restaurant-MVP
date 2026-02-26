export const ROUTES = {
  HOME: "/",
  MENU: "/menu",
  MENU_ITEM: (id: string) => `/menu/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_COMPLETE: (id: string) => `/orders/${id}/complete`,
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCTS_NEW: "/admin/products/new",
  ADMIN_PRODUCTS_EDIT: (id: string) => `/admin/products/${id}/edit`,
};
