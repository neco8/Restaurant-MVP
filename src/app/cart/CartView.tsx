import type { CartItem } from "@/lib";
import { ROUTES, formatPrice, lineTotal, orderTotal } from "@/lib";

export function CartView({ cartItems = [], onDecreaseItem }: { cartItems?: CartItem[]; onDecreaseItem?: (id: string) => void } = {}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-stone-500 mb-8">Your cart is empty</p>
      ) : (
        <div className="mb-8">
          <div className="divide-y divide-stone-200 dark:divide-stone-700">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <span className="font-medium">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-sm text-stone-500 mx-2">×{item.quantity}</span>
                )}
                <button
                  onClick={() => onDecreaseItem?.(item.id)}
                  className="rounded border border-stone-300 px-2 py-1 text-sm text-stone-600 hover:bg-stone-100 transition-colors dark:border-stone-600 dark:text-stone-400 dark:hover:bg-stone-800"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-semibold">{formatPrice(lineTotal(item))}</span>
              </div>
            ))}
          </div>
          <p className="text-lg font-bold mt-4 pt-4 border-t border-stone-300 dark:border-stone-600">
            Total: {formatPrice(orderTotal(cartItems))}
          </p>
        </div>
      )}
      <a
        href={ROUTES.CHECKOUT}
        className="inline-block rounded-lg bg-stone-900 text-white px-6 py-3 font-medium shadow-sm hover:bg-stone-800 transition-colors dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
      >
        Proceed to Checkout
      </a>
    </div>
  );
}
