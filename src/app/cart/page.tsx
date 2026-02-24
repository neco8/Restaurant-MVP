type CartItem = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type Props = {
  getCartItems?: () => Promise<CartItem[]>;
};

export default async function CartPage({ getCartItems }: Props = {}) {
  const items = getCartItems ? await getCartItems() : [];
  return (
    <>
      <h1>Cart</h1>
      {items.map((item) => (
        <span key={item.id}>{item.name}</span>
      ))}
    </>
  );
}
