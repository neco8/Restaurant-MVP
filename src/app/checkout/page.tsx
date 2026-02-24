import { total, lineTotal } from "@/lib/total";
import { formatPrice } from "@/lib/formatPrice";
import type { CartItem } from "@/lib/types";

export default async function CheckoutPage({ items = [] }: { items?: CartItem[] } = {}) {
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
                <li key={item.id}>
                  <span>{item.name}</span>
                  {item.quantity > 1 && <span>×{item.quantity}</span>}
                  <span>{formatPrice(lineTotal(item))}</span>
                </li>
              ))}
            </ul>
            <p>Total: {formatPrice(total(items))}</p>
          </>
        )}
      </section>
      <button disabled={items.length === 0}>Place Order</button>
    </div>
  );
}
