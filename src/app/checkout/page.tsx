import { total, lineTotal } from "@/lib/total";

type Item = { name: string; price: number; quantity: number };

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
                  {item.quantity > 1 && <span>×{item.quantity}</span>}
                  <span>${lineTotal(item).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p>Total: ${total(items).toFixed(2)}</p>
          </>
        )}
      </section>
      <button disabled={items.length === 0}>Place Order</button>
    </div>
  );
}
