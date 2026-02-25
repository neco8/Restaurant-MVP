import type { CartItem } from "@/lib";
import { formatPrice, lineTotal, orderTotal } from "@/lib";

export function CheckoutView({
  cartItems = [],
  loading = false,
  children,
}: {
  cartItems?: CartItem[];
  loading?: boolean;
  children?: React.ReactNode;
} = {}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <section className="rounded-xl border border-stone-200 p-6 mb-8 dark:border-stone-700">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.length === 0 ? (
          <p className="text-stone-500">Your cart is empty</p>
        ) : (
          <>
            <ul className="divide-y divide-stone-200 dark:divide-stone-700 list-none p-0 m-0">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <span className="font-medium">{item.name}</span>
                  {item.quantity > 1 && (
                    <span className="text-sm text-stone-500 mx-2">×{item.quantity}</span>
                  )}
                  <span className="font-semibold">{formatPrice(lineTotal(item))}</span>
                </li>
              ))}
            </ul>
            <p
              data-testid="checkout-total"
              className="text-lg font-bold mt-4 pt-4 border-t border-stone-300 dark:border-stone-600"
            >
              Total: {formatPrice(orderTotal(cartItems))}
            </p>
          </>
        )}
      </section>
      {children ?? (loading ? (
        <p role="status" className="text-stone-500 text-center">Preparing payment…</p>
      ) : (
        <button
          disabled={cartItems.length === 0}
          className="w-full rounded-lg bg-stone-900 text-white px-6 py-3 font-medium shadow-sm hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          Place Order
        </button>
      ))}
    </div>
  );
}
