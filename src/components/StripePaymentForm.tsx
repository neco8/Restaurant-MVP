"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { ROUTES, clearCart } from "@/lib";

const PAYMENT_TIMEOUT_MS = 30_000;

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

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("PAYMENT_TIMEOUT")), PAYMENT_TIMEOUT_MS)
      );
      const result = await Promise.race([
        stripe.confirmPayment({
          elements,
          confirmParams: {},
          redirect: "if_required",
        }),
        timeoutPromise,
      ]);

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setLoading(false);
      } else if (result.paymentIntent?.status === "succeeded" || result.paymentIntent?.status === "processing") {
        clearCart();
        router.push(ROUTES.ORDER_COMPLETE(paymentIntentId));
      } else {
        setError("Payment failed");
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof Error && err.message === "PAYMENT_TIMEOUT") {
        setError("Payment timed out. Please try again.");
      } else {
        setError("Payment failed");
      }
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p role="alert" className="font-sans text-sm text-red-700 border border-red-200 px-5 py-3 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800/50 dark:text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full font-sans text-xs font-medium tracking-widest-2 uppercase bg-foreground text-background px-6 py-4 hover:bg-accent transition-colors duration-300 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
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
  const [stripeError, setStripeError] = useState<string | null>(null);
  const stripePromiseRef = useRef<ReturnType<typeof loadStripe> | null>(null);

  if (!stripePromiseRef.current) {
    stripePromiseRef.current = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }

  useEffect(() => {
    stripePromiseRef.current!.catch(() => {
      setStripeError("Payment system could not be loaded. Please check your connection and try again.");
    });
  }, []);

  if (stripeError) {
    return (
      <div data-testid="stripe-elements">
        <p role="alert">{stripeError}</p>
      </div>
    );
  }

  return (
    <div data-testid="stripe-elements">
      <Elements stripe={stripePromiseRef.current} options={{ clientSecret }}>
        <PaymentForm paymentIntentId={paymentIntentId} />
      </Elements>
    </div>
  );
}
