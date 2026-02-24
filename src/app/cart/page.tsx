import type { CartItem } from "@/lib/types";

type Props = {
  getCartItems?: () => Promise<CartItem[]>;
};

export default async function CartPage({ getCartItems }: Props = {}) {
  const cartItems = getCartItems ? await getCartItems() : [];
  return (
    <>
      <h1>Cart</h1>
      {cartItems.map((item) => (
        <span key={item.id}>{item.name}</span>
      ))}
      <a href="/checkout">Proceed to Checkout</a>
    </>
  );
}
