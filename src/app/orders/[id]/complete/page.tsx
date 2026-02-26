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
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Thank you for your order</h1>
      <p className="text-stone-400 mb-3 dark:text-stone-500">
        Order ID: <span data-testid="order-id" className="font-mono text-stone-600 dark:text-stone-300">{params.id}</span>
      </p>
      <p data-testid="payment-status" className="text-xl font-bold text-amber-700 dark:text-amber-400">{status}</p>
      {explanation && (
        <p data-testid="payment-explanation" className="text-stone-500 mt-4 dark:text-stone-400">{explanation}</p>
      )}
    </div>
  );
}
