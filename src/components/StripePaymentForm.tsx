"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib";

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
    } else if (result.paymentIntent?.status === "succeeded") {
      router.push(ROUTES.ORDER_COMPLETE(result.paymentIntent.id));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={!stripe || loading}>
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
  amountInCents: number;
}) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm paymentIntentId={paymentIntentId} />
    </Elements>
  );
}
