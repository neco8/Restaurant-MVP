"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { ROUTES, clearCart } from "@/lib";

const isMockStripe = process.env.NEXT_PUBLIC_MOCK_STRIPE === "true";

const stripePromise = isMockStripe
  ? null
  : loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function RealPaymentForm({ paymentIntentId }: { paymentIntentId: string }) {
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
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}

const CARD_NUMBER_SRCDOC = `<html><body style="margin:0"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;box-sizing:border-box;" oninput="this.value=this.value.replace(/\\D/g,'').replace(/(.{4})/g,'$1 ').trim()" /></body></html>`;
const FIELD_SRCDOC = `<html><body style="margin:0"><input type="text" style="width:100%;padding:8px;border:1px solid #ccc;box-sizing:border-box;" /></body></html>`;

function MockPaymentForm({ paymentIntentId }: { paymentIntentId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    clearCart();
    router.push(ROUTES.ORDER_COMPLETE(paymentIntentId));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <iframe title="Card number" srcDoc={CARD_NUMBER_SRCDOC} />
        <iframe title="Expiration date" srcDoc={FIELD_SRCDOC} />
        <iframe title="Security code" srcDoc={FIELD_SRCDOC} />
      </div>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={loading}>
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
  if (isMockStripe) {
    return (
      <div data-testid="stripe-elements">
        <MockPaymentForm paymentIntentId={paymentIntentId} />
      </div>
    );
  }

  return (
    <div data-testid="stripe-elements">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <RealPaymentForm paymentIntentId={paymentIntentId} />
      </Elements>
    </div>
  );
}
