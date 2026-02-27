import type { CartItem } from "@/lib";
import { ROUTES, formatPrice, lineTotal, orderTotal } from "@/lib";

export function CartView({ cartItems = [], onDecreaseItem }: { cartItems?: CartItem[]; onDecreaseItem?: (id: string) => void } = {}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
      <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
        Your Order
      </p>
      <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[0.9] mb-16">Cart</h1>
      {cartItems.length === 0 ? (
        <p className="font-serif text-base font-light italic text-muted mb-12">Your cart is empty</p>
      ) : (
        <div className="mb-12">
          <div className="divide-y divide-border">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-5">
                <span className="font-serif text-lg font-normal">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="font-sans text-xs text-muted mx-3 tabular-nums">×{item.quantity}</span>
                )}
                <button
                  onClick={() => onDecreaseItem?.(item.id)}
                  className="border border-border px-2 py-1 text-sm text-muted hover:border-accent hover:text-accent transition-colors duration-200"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-sans text-sm font-light tracking-wider text-muted tabular-nums ml-4">{formatPrice(lineTotal(item))}</span>
              </div>
            ))}
          </div>
          <p className="font-serif text-xl font-normal mt-6 pt-6 border-t border-foreground">
            Total: {formatPrice(orderTotal(cartItems))}
          </p>
        </div>
      )}
      <a
        href={ROUTES.CHECKOUT}
        className="inline-block font-sans text-xs font-medium tracking-widest-2 uppercase bg-foreground text-background px-10 py-4 hover:bg-accent transition-colors duration-300 active:scale-[0.98]"
      >
        Proceed to Checkout
      </a>
    </div>
  );
}
