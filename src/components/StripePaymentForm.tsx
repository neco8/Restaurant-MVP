"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { ROUTES, clearCart } from "@/lib";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ paymentIntentId }: { paymentIntentId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message ?? "Payment failed");
      setLoading(false);
    } else if (result.paymentIntent?.status === "succeeded" || result.paymentIntent?.status === "processing") {
      clearCart();
      router.push(ROUTES.ORDER_COMPLETE(paymentIntentId));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      {error && <p role="alert" className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-3 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-full bg-amber-600 text-white px-6 py-3.5 font-semibold shadow-lg shadow-amber-600/20 hover:bg-amber-700 hover:shadow-amber-700/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400 dark:shadow-amber-500/20"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}

export function StripePaymentForm({
  clientSecret,
  paymentIntentId,
}: {
  clientSecret: string;
  paymentIntentId: string;
}) {
  return (
    <div data-testid="stripe-elements">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm paymentIntentId={paymentIntentId} />
      </Elements>
    </div>
  );
}
