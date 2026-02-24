type Item = { name: string; price: number };

function total(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

export default async function CheckoutPage({ items = [] }: { items?: Item[] } = {}) {
  return (
    <div>
      <h1>Checkout</h1>
      <section>
        <h2>Order Summary</h2>
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <ul>
              {items.map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p>Total: ${total(items).toFixed(2)}</p>
          </>
        )}
      </section>
      <button>Place Order</button>
    </div>
  );
}
