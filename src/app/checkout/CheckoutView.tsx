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
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-10">Checkout</h1>
      <section className="rounded-2xl border border-stone-200 bg-white p-6 mb-10 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h2 className="text-xl font-bold mb-5">Order Summary</h2>
        {cartItems.length === 0 ? (
          <p className="text-stone-400 dark:text-stone-500">Your cart is empty</p>
        ) : (
          <>
            <ul className="divide-y divide-stone-100 dark:divide-stone-800 list-none p-0 m-0">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <span className="font-semibold">{item.name}</span>
                  {item.quantity > 1 && (
                    <span className="text-sm text-stone-400 mx-2 tabular-nums">×{item.quantity}</span>
                  )}
                  <span className="font-bold tabular-nums">{formatPrice(lineTotal(item))}</span>
                </li>
              ))}
            </ul>
            <p
              data-testid="checkout-total"
              className="text-lg font-extrabold mt-4 pt-4 border-t border-stone-200 dark:border-stone-700"
            >
              Total: {formatPrice(orderTotal(cartItems))}
            </p>
          </>
        )}
      </section>
      {children ?? (loading ? (
        <p role="status" className="text-stone-400 text-center animate-pulse dark:text-stone-500">Preparing payment…</p>
      ) : (
        <button
          disabled={cartItems.length === 0}
          className="w-full rounded-full bg-amber-600 text-white px-6 py-3.5 font-semibold shadow-lg shadow-amber-600/20 hover:bg-amber-700 hover:shadow-amber-700/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400 dark:shadow-amber-500/20"
        >
          Place Order
        </button>
      ))}
    </div>
  );
}
