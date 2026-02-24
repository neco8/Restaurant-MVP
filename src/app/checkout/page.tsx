type Item = { name: string; price: number };

export default async function CheckoutPage({ items = [] }: { items?: Item[] } = {}) {
  return (
    <div>
      <h1>Checkout</h1>
      <section>
        <h2>Order Summary</h2>
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.name}>{item.name}</li>
            ))}
          </ul>
        )}
      </section>
      <button>Place Order</button>
    </div>
  );
}
