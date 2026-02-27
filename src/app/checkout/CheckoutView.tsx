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
    <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
      <p className="font-sans text-[0.65rem] font-light tracking-widest-3 uppercase text-muted mb-4">
        Complete Your Order
      </p>
      <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight leading-[0.9] mb-16">Checkout</h1>
      <section className="border border-border p-8 mb-12">
        <h2 className="font-sans text-xs font-medium tracking-widest-2 uppercase text-accent mb-6 pb-3 border-b border-border">Order Summary</h2>
        {cartItems.length === 0 ? (
          <p className="font-serif text-base font-light italic text-muted">Your cart is empty</p>
        ) : (
          <>
            <ul className="divide-y divide-border list-none p-0 m-0">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-4">
                  <span className="font-serif text-lg font-normal">{item.name}</span>
                  {item.quantity > 1 && (
                    <span className="font-sans text-xs text-muted mx-3 tabular-nums">×{item.quantity}</span>
                  )}
                  <span className="font-sans text-sm font-light tracking-wider text-muted tabular-nums">{formatPrice(lineTotal(item))}</span>
                </li>
              ))}
            </ul>
            <p
              data-testid="checkout-total"
              className="font-serif text-xl font-normal mt-6 pt-6 border-t border-foreground"
            >
              Total: {formatPrice(orderTotal(cartItems))}
            </p>
          </>
        )}
      </section>
      {children ?? (loading ? (
        <p role="status" className="font-serif text-base italic text-muted text-center animate-pulse">Preparing payment…</p>
      ) : (
        <button
          disabled={cartItems.length === 0}
          className="w-full font-sans text-xs font-medium tracking-widest-2 uppercase bg-foreground text-background px-6 py-4 hover:bg-accent transition-colors duration-300 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Place Order
        </button>
      ))}
    </div>
  );
}
