import { createStripeClient } from "@/server/stripeClient";

type Props = {
  params: { id: string };
};

export default async function OrderCompletePage({ params }: Props) {
  let status = "Payment Failed";
  let explanation: string | null = null;

  const stripe = createStripeClient();
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(params.id);
    switch (paymentIntent.status) {
      case "succeeded":
        status = "Payment Complete";
        break;
      case "processing":
        status = "Payment Processing";
        explanation = "Your payment is being processed. You will receive confirmation shortly.";
        break;
      case "requires_payment_method":
        status = "Payment Failed";
        explanation = "Your payment method was not accepted. Please return to checkout and try again.";
        break;
      case "canceled":
        status = "Payment Failed";
        explanation = "This payment was canceled.";
        break;
      case "requires_confirmation":
      case "requires_action":
      case "requires_capture":
        status = "Payment Failed";
        break;
    }
  } catch {
    explanation = "We could not retrieve your payment status. Please contact support if you were charged.";
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <div className="w-px h-16 bg-accent mx-auto mb-10" />
      <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight leading-[0.95] mb-10">Thank you for your order</h1>
      <p className="font-sans text-xs tracking-widest uppercase text-muted mb-4">
        Order ID: <span data-testid="order-id" className="font-mono text-foreground">{params.id}</span>
      </p>
      <p data-testid="payment-status" className="font-serif text-2xl font-light italic text-accent">{status}</p>
      {explanation && (
        <p data-testid="payment-explanation" className="font-serif text-base font-light text-muted mt-6 max-w-md mx-auto leading-relaxed">{explanation}</p>
      )}
    </div>
  );
}
