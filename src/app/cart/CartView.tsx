import type { CartItem } from "@/lib";
import { ROUTES, formatPrice, lineTotal, orderTotal } from "@/lib";

export function CartView({ cartItems = [] }: { cartItems?: CartItem[] } = {}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-10">Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-stone-400 mb-10 dark:text-stone-500">Your cart is empty</p>
      ) : (
        <div className="mb-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <span className="font-semibold">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-sm text-stone-400 mx-2 tabular-nums">×{item.quantity}</span>
                )}
                <span className="font-bold tabular-nums">{formatPrice(lineTotal(item))}</span>
              </div>
            ))}
          </div>
          <p className="text-lg font-extrabold mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
            Total: {formatPrice(orderTotal(cartItems))}
          </p>
        </div>
      )}
      <a
        href={ROUTES.CHECKOUT}
        className="inline-block rounded-full bg-amber-600 text-white px-8 py-3 font-semibold shadow-lg shadow-amber-600/20 hover:bg-amber-700 hover:shadow-amber-700/25 active:scale-[0.98] transition-all dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400 dark:shadow-amber-500/20"
      >
        Proceed to Checkout
      </a>
    </div>
  );
}
